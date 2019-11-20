# VueWidget

Vue.js widgets for Magento 2.

## About

This is Magento 2 module skeleton for building and displaying widgets made with [Vue.js](https://vuejs.org/). It comes with Vue.js 2.x plus some scripts and components to get you started.

## Requirements

This module assumes you are running Magento >=2.2. You'll also need [Rollup](https://rollupjs.org/) installed.

## Quick start

Enter the `app/code/` directory and clone the repo:

```
cd app/code/ && git clone https://github.com/emaphp/magento2-module-vuewidget Vue/Widget
```

Install Node dependencies. You can use either `npm` or `yarn`:

```
cd Vue/Widget && npm install
```

Do a first build. This will compile some generic components available on the `assets/` folder:

```
npm run build
```

Go back to the main application folder. Enable the module:

```
php bin/magento module:enable Vue_Widget --clear-static-content
php bin/magento setup:upgrade && php bin/magento setup:di:compile
```

Clear cache:

```
php bin/magento cache:clean
```

## Usage

Login as admin. Go to *Stores* > *Settings* > *Configuration*. You should be able to see a new option at the bottom called *Vue Widget*. Now, from the main menu, go to *Content* > *Elements* > *Widgets*. Click on *Add Widget*. On the *Settings* section, click on the *Type* field. A *Vue Widget* option should appear at the bottom. Then pick the area where the widget should be included (for example, within *CMS Home Page*).

![New Widget](https://drive.google.com/uc?export=view&id=1DeV-wssxOGNppjQivWDs1i9D16PPPArY "")

Widgets are included by name; that is, the id used to register them on `requirejs-config.js`. Try entering `VueHelloWorld` on the *Component* field. Then, click on the *Add* button on the form below. This component supports a single `prop` called `name`. Entering a *prop* is pretty straighforward, just fill the *Name* and *Value* columns. Then, hit *Save*.

![Widget Props](https://drive.google.com/uc?export=view&id=182HW9G34SQWXlC-U_eF6HaFeuaBuCWg- "")

Clear cache and refresh the page. You should be able to view your widget on the page you selected.

## In-Depth

### Adding components

The process of adding components to your app will consist on these steps:

 * Write the component using the `.vue` syntax. Put it inside the `assets/frontend/components` folder.
 * Compile the component using `rollup`.
 * Deploy assets and clear cache.

This module assumes you're already familiar with building Vue.js components, so we'll only cover the second step. By default, Magento is not able to understand files using the `.vue` extension (or anything using ES6/ES7). To solve this, this repo includes a build system that allows you to turn these files into something that can be included within the page through *RequireJS*. The process starts by defining which files need to be transpiled. That info can be found within `rollup.config.js`. The structure of this file is pretty straightforward: an array containing which files should be transpiled and what plugins are required to do so. Create a file inside `assets/frontend/components/` called `VueCounter.vue` and put the following content:

```vue
<!-- File: assets/frontend/components/VueCounter.vue -->

<template>
  <button class="action primary" type="button" title="Vue Counter" v-on:click="increment">
    <span>Count: {{count}}</span>
  </button>
</template>

<script>
export default {
  data () {
    return {
      count: 0
    }
  },

  methods: {
    increment: function () {
      this.count++;
    }
  }
}
</script>
```

Now, in order to transpile this file to plain Javascript we need to add an additional entry in `rollup.config.js`. It should look like this:

```javascript
  {
    input: './assets/frontend/components/VueCounter.vue',
    output: {
      file: './view/frontend/web/js/components/VueCounter.js',
      format: 'iife',
      name: 'bundle',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      vue(),
      magento2()
    ]
  }
```

This entry tells `rollup` to transpile the file and put the resulting content in `view/frontend/web/js/components/VueCounter.js`. Open a terminal and run the following command (make sure you're on the module directory):

```
npm run build
```

`rollup` will now run each entry and generate each bundle separately. This build system uses [rollup-plugin-magento2](https://github.com/emaphp/rollup-plugin-magento2) internally to wrap each bundle into something that can be imported using *RequireJS*. Once this process is finished, your module is compiled and can now be used as a widget.

We will create a new alias for this component by adding the following line in `requirejs-config.js`:

```javascript
// File: view/frontend/requirejs-config.js

var config = {
  map: {
    '*': {
      'VueCounter': 'Vue_Widget/js/components/VueCounter'
    }
  }
};
```

Now, login as admin and repeat the steps described in the *Quick Start* guide. When reaching the *Widget Options* section, simply enter *VueCounter* on the *Component* field. Clear cache and reload the page.

### Vue blocks

Widgets are nice but they are kind of limited. For example, you are not able to pass a prop directly from PHP. Because of this, an extended script called `vueapp` is provided as an alternative. `vueapp` lets you inject Vue components into your regular HTML blocks. When used this way, the block acts as a component container. Any component that is displayed within must be listed inside the `components` property:

```html
<!-- File: view/frontend/templates/vue-block-example.phtml -->

<div id="vue-block-example">
    <vue-customer-greeting name="<?php echo $this->getCustomerName() ?>" />
</div>
<script type="text/x-magento-init">
 {
   "#vue-block-example": {
     "vueapp": {
       "components": [
         "VueCustomerGreeting"
       ]
     }
   }
 }
</script>
```

This example introduces a simple greeting component that reads a prop from PHP. The component should look like this:

```vue
<!-- File: assets/frontend/components/VueCustomerGreeting.vue -->

<template>
  <h5>Hello {{name}}! Welcome to our store.</h5>
</template>

<script>
export default {
  props: [ 'name' ]
};
</script>
```

We will register this component as `VueCustomerGreeting`:

```javascript
// File: view/frontend/requirejs-config.js

var config = {
  map: {
    '*': {
      'VueCustomerGreeting': 'Vue_Widget/js/components/VueCustomerGreeting'
    }
  }
};
```

The block class purpose is to initialize any values that need to be provided to your component.

```php
<?php
// File: Block/Widget/VueBlockExample.php

namespace Vue\Widget\Block\Widget;

use Magento\Framework\View\Element\Template;
use Magento\Widget\Block\BlockInterface;
use Vue\Widget\Logger\Logger;

class VueBlockExample extends Template implements BlockInterface {
    protected $logger;

    public function __construct(
        Template\Context $context,
        Logger $logger,
        array $data = []
    ) {
        $this->logger = $logger;
        parent::__construct($context, $data);
    }

    public function getCustomerName() {
        $this->logger->debug('Getting customer name...');
        return 'Guest';
    }
}
```

Vue blocks are just regular `.phtml` blocks so they are included using the XML layout system. The example below will add this block to the front page.

```xml
<!-- File: view/frontend/layout/cms_index_index.xml -->

<?xml version="1.0"?>
<page xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="urn:magento:framework:View/Layout/etc/page_configuration.xsd">
    <body>
      <referenceContainer name="main">
        <container name="vue-block-example" htmlTag="div" after="-">
          <block class="Vue\Widget\Block\Widget\VueBlockExample" name="vue.block.example" template="Vue_Widget::vue-block-example.phtml"/>
        </container>
      </referenceContainer>
    </body>
</page>
```

Add this new component to the entry list in `rollup.config.js`. Run `npm run build`, rebuild the layout and clear cache. You should now be able to see the changes.

### Data provider

There will be times that you'll need to pass data to a component as an array/object. Encoding them as props might work at first but doing that for each value it's kind of cumbersome. In order to pass complex data to a component we'll use a common pattern used in Vue components called *Data Provider*. A *Data Provider* is a form of *dependency injection* that will allow you to share a set of data across all components within a block. This object will be generated whenever you set a `provider` property on the `vueapp` initializer.

```html
<!-- File: view/frontend/templates/data-provider-example.phtml -->

<div id="data-provider-example">
    <data-provider-component />
</div>
<script type="text/x-magento-init">
 {
   "#data-provider-example": {
     "vueapp": {
       "components": [
         "DataProviderComponent"
       ],
       "provider": {
         "categories": <?php echo json_encode($this->getCategories()) ?>,
         "author": <?php echo json_encode($this->getAuthor(), JSON_FORCE_OBJECT) ?>
       }
     }
   }
 }
</script>
```

Both of these values will be provided by the block instance directly.

```php
<?php

// File: Block/Widget/DataProviderExample.php

namespace Vue\Widget\Block\Widget;

use Magento\Framework\View\Element\Template;
use Magento\Widget\Block\BlockInterface;
use Vue\Widget\Logger\Logger;

class DataProviderExample extends Template implements BlockInterface {
    public function __construct(
        Template\Context $context,
        Logger $logger,
        array $data = []
    ) {
        $this->logger = $logger;
        parent::__construct($context, $data);
    }

    public function getCategories() {
        return [
            'Pants',
            'T-Shirts',
            'Shoes',
            'Ties'
        ];
    }
 
    public function getAuthor() {
      return [
        'name'   => "Emma",
        'role'   => "Developer",
        'github' => "https://github.com/emaphp",
      ];
    }
}
```

Now, to access these values from within our component we'll invoke the `get` method on the `$provider` property.

```javascript
const { categories, author } = this.$provider.get();
```

You can also specify a property key. 

```javascript
// Single key
const categories = this.$provider.get('categories'); // [ 'Pants', 'T-Shirts', ... ]
```

Keys can be expressed as paths.

```javascript
// Path
const role = this.$provider.get('author.role'); // "Developer"
```

### Placeholders

Vue blocks can include a placeholder within their layout to provide a temporal UI. These  will be removed automatically once the component is initialized. Placeholder elements have the following properties:

 * They need to set their `role` attribute to `placeholder`.
 * They must be a direct child of the app container.
 
```html
<!-- File: view/frontend/templates/placeholder-example.phtml -->

<div id="placeholder-example">
    <h3 role="placeholder">Loading...</h3>
    <slow-widget></slow-widget>
</div>
<script type="text/x-magento-init">
 {
   "#placeholder-example": {
     "vueapp": {
       "components": [ "SlowWidget" ]
     }
   }
 }
</script>
```

There are scenarios in which you might want to delay the removal of a placeholder even more (for example, right after fetching data from the server). This can be done by adding the `placeholderMixin`mixin to your main component. This mixin injects a `$placeholder` property that provides 2 methods: `hide` and `remove`.

```javascript
// File: assets/frontend/components/CustomPlaceholderComponent.vue

import placeholderMixin from '../mixins/placeholderMixin';

export default {
  mixins: [ placeholderMixin ],
  
  mounted() {
    // Fetch data
    fetch('https://api.spacexdata.com/v3/launches/latest')
    .then(response => response.json())
    .then(data => {
      // ...
      this.$placeholder.hide();
    });
  }
};
```

Since we're now dealing with the placeholder directly, we need to include an extra property on the `vueapp` initializer:

```html
<!-- File: view/frontend/templates/custom-placeholder.phtml -->

<div id="custom-placeholder">
    <h3 role="placeholder">Loading...</h3>
    <custom-placeholder-component></custom-placeholder-component>
</div>
<script type="text/x-magento-init">
 {
   "#example-placeholder": {
     "vueapp": {
       "components": [ "CustomPlaceholderComponent" ],
       "placeholder": "custom"
     }
   }
 }
</script>
```

By setting this property, the app will now ignore any placeholder element within the block body.

#### Events

Placeholders can also be affected by a given event. For that to happen we need to provide a `placeholder` value matching the `event:action` syntax:

```html
<!-- File: view/frontend/templates/placeholder-event.phtml -->

<div id="placeholder-event">
    <h3 role="placeholder">Loading...</h3>
    <placeholder-event-component />
</div>
<script type="text/x-magento-init">
 {
   "#placeholder-event": {
     "vueapp": {
       "components": [ "PlaceholderEventComponent" ],
       "placeholder": "loaded:hide"
     }
   }
 }
</script>
```

When the `loaded` event is triggered, the component will call the `hide` method of the placeholder object. A `remove` method is also available.

```javascript
// File: assets/frontend/components/CustomPlaceholderComponent.vue

import placeholderMixin from '../mixins/placeholderMixin';

export default {
  mixins: [ placeholderMixin ],
  
  mounted() {
    // Fetch data
    fetch('https://api.spacexdata.com/v3/launches/latest')
    .then(response => response.json())
    .then(data => {
      // ...
      this.$emit('loaded');
    });
  }
};
```

You can also specify a custom method. That method needs to be declared within `methods` and accept a single argument representing the placeholder node.

```html
<!-- File: view/frontend/templates/placeholder-event.phtml -->

<script type="text/x-magento-init">
 {
   "#placeholder-event": {
     "vueapp": {
       "components": [ "PlaceholderEventComponent" ],
       "placeholder": "loaded:fadeOut"
     }
   }
 }
</script>
```

```javascript
// File: assets/frontend/components/PlaceholderEventComponent.vue

export default {
  methods: {
    fadeOut(placeholder) {
      placeholder.classList.add('animate', 'fadeOutDown');
    }
  }
}
```

### Importing Magento modules

There will be times that you'll have to access Javascript modules already provided by Magento. For example, you might need to generate changes on the DOM using *jQuery* or do a calculation using *Underscore*. We can achieve this by providing an extra option to the transpilation process. The Magento plugin used in `rollup.config.js` supports an option called `virtualDir` that allow us to simulate a generic import to a Javascript module. No real import is performed. Instead, the script, once transpiled, will state that it depends on those imported modules. The example below shows an entry setting the `virtualDir` option:

```javascript
  {
    input: './assets/frontend/components/ImportExampleWidget.vue',
    output: {
      file: './view/frontend/web/js/components/ImportExampleWidget.js',
      format: 'iife',
      name: 'bundle',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      vue(),
      magento2({
        virtualDir: 'magento'
      }),
    ]
  }
```

Now, when importing a Javascript module, prefix the module's name with the *virtual directory*. You need to add an extra `@` symbol at the beginning.

```javascript
// File: assets/frontend/components/ImportExampleWidget.vue

import $ from '@magento/jquery';
import { debounce } from '@magento/underscore';
```

Once transpiled, the script will add any module you imported from the *virtual directory* to the list of dependencies. That way, we make sure the script will only run after those scripts are loaded.

### Component libraries

Another clever technique is putting all you components within a single file. This is useful for cases when you are reusing a lot of components on different pages. A library script would look like this:

```javascript
// File: assets/frontend/fancy_lib.js

import Vue from '@magento/vue';

import FancyButton from './components/FancyButton.vue';
import FancyCard from './components/FancyCard.vue';

export default {
  FancyButton,
  FancyCard
};
```

We then add the following entry in `rollup.config.js`:

```javascript
  {
    input: './assets/frontend/fancy_lib.js',
    output: {
      file: './view/frontend/web/js/fancy_lib.js',
      format: 'iife',
      name: 'bundle',
    },
    plugins: [
      babel({
        exclude: 'node_modules/**'
      }),
      resolve(),
      commonjs(),
      vue(),
      magento2({
        virtualDir: "magento"
      }),
    ]
  }
```

Then, we create the following alias in `requirejs-config.js`:

```javascript
var config = {
  map: {
    '*': {
      'Fancy_Lib: 'Vue_Widget/js/fancy_lib'
    }
  }
};
```

In order to retrieve the components within a library we'll add a special syntax element to the mix. To retrieve the `FancyButton` component from `Fancy_Lib` we'll write `Fancy_Lib::FancyButton`. This rule applies both to widgets and apps.

```html
<!-- File: view/frontend/templates/library-example.phtml -->

<div id="library-example">
    <fancy-button></fancy-button>
</div>
<script type="text/x-magento-init">
 {
   "#library-example": {
     "vueapp": {
       "components": [ "Fancy_Lib::FancyButton" ]
     }
   }
 }
</script>
```

## Extras

### Administration widgets

This module already comes with an administration widget called `WidgetProps`, which you can find in `assets/adminhtml/components`. This widget is the one responsible for storing the component props on the database. If you plan to change or add more administration widgets remember to properly clear the `adminhtml` cache as well (which will be located in `pub/static/adminhtml/THEME_DIR`). Otherwise you might not see any changes during development.

As an additional note, the `Widget\Instance` class on the `Magento_Widget` module is overriden to allow props to be provided as an object once they are pushed to frontend. Check out the `Vue\Widget\Model\Widget\Intance` class for details.

### Logs

This module implements a simple logger class that can be injected into any block through dependency injection. Many of the examples use this class to generate debugging messages. You can find these messages on `var/log/vuewidget.log`. Remember to activate *developer mode* before starting.

## TODOs

 - [ ] Production builds.

## License

Vue.js is copyrighted by Evan You and distributed under the terms of the MIT license. Everything else included on this repo is distributed under the MIT license.
