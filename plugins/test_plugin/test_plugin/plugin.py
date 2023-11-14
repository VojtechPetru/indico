# This file is part of the Indico plugins.
# Copyright (C) 2002 - 2022 CERN
#
# The Indico plugins are free software; you can redistribute
# them and/or modify them under the terms of the MIT License;
# see the LICENSE file for more details.
from indico.core import signals
from indico.core.plugins import IndicoPlugin, PluginCategory, IndicoPluginBlueprint
from indico.web.forms.base import IndicoForm


blueprint = IndicoPluginBlueprint('test_plugin', 'indico_test_plugin')


class SettingsForm(IndicoForm):
    pass


class TestPlugin(IndicoPlugin):
    """TestPlugin

    TEST DOCUMENTATION
    """
    configurable = True
    settings_form = SettingsForm
    default_settings = {}
    category = PluginCategory.other

    def init(self):
        print('TEST PLUGIN: init')
        super().init()
        self.backend_classes = {}
        self.connect(signals.rb.booking_modified, self._handle_booking_modified)
        self.inject_bundle('test_component.js')

    def get_blueprints(self):
        return blueprint

    def _handle_booking_modified(self, sender, **kwargs):
        print('TEST PLUGIN: booking modified', sender, kwargs)

