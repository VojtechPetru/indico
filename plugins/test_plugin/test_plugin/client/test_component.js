import {registerPluginComponent} from 'indico/utils/plugins';
import Test from './Test';

registerPluginComponent('test_plugin', 'test_component', Test);
