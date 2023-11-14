from setuptools import setup

setup(
    name='test_plugin',
    version='0.0.1',
    py_modules=['test_plugin'],
    entry_points={'indico.plugins': {'test_plugin = plugins.test_plugin.test_plugin.plugin:TestPlugin'}}
)
