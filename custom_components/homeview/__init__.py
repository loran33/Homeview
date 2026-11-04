"""Homeview — a drag and drop Lovelace dashboard builder."""

from __future__ import annotations

import logging
from functools import partial
from pathlib import Path

import voluptuous as vol

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.typing import ConfigType

from .const import (
    DOMAIN,
    PANEL_COMPONENT,
    PANEL_ICON,
    PANEL_TITLE,
    PANEL_URL_PATH,
    STATIC_URL,
)

_LOGGER = logging.getLogger(__name__)

FRONTEND_DIR = Path(__file__).parent / "frontend"
DATA_REGISTERED = f"{DOMAIN}_registered"

HomeviewConfigEntry = ConfigEntry[None]

# `homeview:` sets the panel up from YAML, without the config flow. There is
# nothing to configure, so the flow is only the convenient path; this is the
# fallback when the add-integration dialog cannot reach its HTTP endpoint.
CONFIG_SCHEMA = vol.Schema(
    {vol.Optional(DOMAIN): vol.Schema({})},
    extra=vol.ALLOW_EXTRA,
)


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the panel when `homeview:` is present in configuration.yaml."""
    if DOMAIN in config:
        await _async_register(hass)
    return True


async def async_setup_entry(hass: HomeAssistant, entry: HomeviewConfigEntry) -> bool:
    """Register the panel for a config entry created by the flow."""
    if not await _async_register(hass):
        return False
    entry.async_on_unload(partial(_async_unregister, hass))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: HomeviewConfigEntry) -> bool:
    """The panel is removed by the unload callback registered at setup."""
    return True


async def _async_register(hass: HomeAssistant) -> bool:
    """Serve the builder bundle and add its sidebar panel. Idempotent.

    The bundle is built by `frontend/` and committed here, because HACS installs
    this directory as-is: nothing runs npm during an install.
    """
    if hass.data.get(DATA_REGISTERED):
        return True

    bundle = FRONTEND_DIR / f"{PANEL_COMPONENT}.js"
    if not bundle.is_file():
        _LOGGER.error(
            "Homeview bundle missing at %s — run 'npm run build' in frontend/ and "
            "commit custom_components/homeview/frontend/",
            bundle,
        )
        return False

    await hass.http.async_register_static_paths(
        [
            # cache_headers=False: /local/ is cached for 31 days, which would pin
            # clients to a stale bundle after an update.
            StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=False)
        ]
    )

    await panel_custom.async_register_panel(
        hass,
        webcomponent_name=PANEL_COMPONENT,
        frontend_url_path=PANEL_URL_PATH,
        module_url=f"{STATIC_URL}/{PANEL_COMPONENT}.js",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        require_admin=True,
        embed_iframe=False,
    )

    hass.data[DATA_REGISTERED] = True
    return True


def _async_unregister(hass: HomeAssistant) -> None:
    """Drop the panel and the flag so a re-added entry can register again."""
    async_remove_panel(hass, PANEL_URL_PATH)
    hass.data.pop(DATA_REGISTERED, None)
