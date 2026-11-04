"""Homeview — a drag and drop Lovelace dashboard builder."""

from __future__ import annotations

import logging
from functools import partial
from pathlib import Path

from homeassistant.components import panel_custom
from homeassistant.components.frontend import async_remove_panel
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant

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
DATA_STATIC_REGISTERED = f"{DOMAIN}_static_registered"

HomeviewConfigEntry = ConfigEntry[None]


async def async_setup_entry(hass: HomeAssistant, entry: HomeviewConfigEntry) -> bool:
    """Serve the builder bundle and add its panel to the sidebar.

    The bundle is built by `frontend/` and committed here, because HACS installs
    this directory as-is: nothing runs npm during an install.
    """
    bundle = FRONTEND_DIR / f"{PANEL_COMPONENT}.js"
    if not bundle.is_file():
        _LOGGER.error(
            "Homeview bundle missing at %s — run 'npm run build' in frontend/ and "
            "commit custom_components/homeview/frontend/",
            bundle,
        )
        return False

    # A reload would otherwise raise on the duplicate registration.
    if not hass.data.get(DATA_STATIC_REGISTERED):
        await hass.http.async_register_static_paths(
            [
                # cache_headers=False: /local/ is cached for 31 days, which would
                # pin clients to a stale bundle after an update.
                StaticPathConfig(STATIC_URL, str(FRONTEND_DIR), cache_headers=False)
            ]
        )
        hass.data[DATA_STATIC_REGISTERED] = True

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

    entry.async_on_unload(partial(async_remove_panel, hass, PANEL_URL_PATH))
    return True


async def async_unload_entry(hass: HomeAssistant, entry: HomeviewConfigEntry) -> bool:
    """The panel is removed by the unload callback registered at setup."""
    return True
