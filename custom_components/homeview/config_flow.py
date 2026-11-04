"""Config flow for Homeview."""

from __future__ import annotations

from typing import Any

from homeassistant.config_entries import ConfigFlow, ConfigFlowResult

from .const import DOMAIN


class HomeviewConfigFlow(ConfigFlow, domain=DOMAIN):
    """Single step: the panel is the whole integration, there is nothing to ask."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> ConfigFlowResult:
        """Add the panel once."""
        if self._async_current_entries():
            return self.async_abort(reason="single_instance_allowed")

        if user_input is not None:
            return self.async_create_entry(title="Homeview", data={})

        return self.async_show_form(step_id="user")
