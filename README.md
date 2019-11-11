# VueWidget

Vue.js widgets for Magento 2.

## About

This is Magento 2 module skeleton for building and displaying widgets made with [Vue.js](https://vuejs.org/).

## Requirements

This module assumes you are running Magento >=2.2. You'll also need [Rollup](https://rollupjs.org/) installed.

## Quick start

Enter the `code/` directory and clone the repo:

```
cd code/ && git clone https://github.com/emaphp/magento2-module-vuewidget Vue/Widget
```

Install frontend dependencies. You can use either `npm` or `yarn`:

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

Login as admin. Go to *Stores* > *Settings* > *Configuration*. You should be able to see a new option at the bottom called *Vue Widget*. Now, from the main menu, go to *Content* > *Elements* > *Widgets*. Click on *Add Widget*. On the *Settings* section, click on the *Type* field. A *Vue Widget* option should appear. After selecting where the widget should appear, you'll arrive at the *Widget Options* section.

[TODO]

Widgets are included by name; that is, the id used to register them on `requirejs-config.js`. Try entering `VueHelloWorld` on the *Component* field. Then, click on the *Add* button on the form below. This component supports a single `prop` called `name`. Entering a *prop* is pretty straighforward, just fill the *Name* and *Value* columns. Then, hit *Save*.

[TODO]

Clear cache and refresh the page. You should be able to view your widget on the page you selected.

## In-Depth

### Adding components

The process of adding components to your app will consist on these steps:

 * Write the component using the `.vue` format.
 * Compile the component with `rollup`.
 * Clear cache.

This module assumes you're already familiar with building Vue.js components, so we'll only cover the second step. By default, Magento is not able to understand files using the `.vue` extension (or anything using ES6/ES7). To solve this, this repo includes a build system that allows you to turn these files into something that can be included within the page through *RequireJS*. The process starts by defining which files need to be transpiled. That info can be found within `rollup.config.js`. The structure of this file is pretty straightforward: an array containing which files should be transpiled and what plugins are required to do so. Create a file inside `assets/frontend/components/` called `MyVueWidget.vue` and put the following content:

```vue
<!-- File: assets/frontend/components/MyVueWidget.vue -->

<template>
  <h3>{{message}}</h3>
</template>

<script>
export default {
  data () {
    return {
      message: 'Hello World!'
    }
  },
}
</script>
```

Now, in order to translate this file to plain Javascript we need to add an additional entry in `rollup.config.js`. It should look like this:

```javascript
  {
    input: './assets/frontend/components/MyVueWidget.vue',
    output: {
      file: './view/frontend/web/js/components/MyVueWidget.js',
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

This entry tells `rollup` to transpile the file we just created and put the resulting content on `view/frontend/web/js/components/MyVueWidget.js`, which can now be loaded as a regular Javascript module. To transpile this file you need to open a terminal and run the following (make sure you're on the module directory):

```
npm run build
```

`rollup` will now run each entry and generate each bundle separately. This build system uses [rollup-plugin-magento2](https://github.com/emaphp/rollup-plugin-magento2) internally to wrap each bundle into something that can be imported using *RequireJS*. Once this process is finished, your module is compiled and can now be injected into the site as a widget.

We will create a new alias for this component by adding the following line in `requirejs-config.js`:

```javascript
// File: view/frontend/requirejs-config.js

var config = {
  map: {
    '*': {
      'MyVueWidget': 'Vue_Widget/js/components/MyVueWidget
    }
  }
};
```

Now, login as admin and repeat the steps described in the *Quick Start* guide. When reaching the *Widget Options* section, simply enter *MyVueWidget* on the *Component* field. Clear cache and reload the page.

### Vue blocks

Widgets are nice but they are kind of limited. For example, you are not able to pass a prop directly from PHP. Because of this, an extended script called `vueapp` is provided as an alternative. `vueapp` lets you inject Vue components into your regular HTML blocks. When used this way, the block acts as a component container. Any component that is displayed within must be listed inside the `components` property:

```html
<!-- File: view/frontend/templates/vue-block-example.phtml -->

<div id="vue-block-example">
    <hello-vue-widget name="<?php echo $this->getCustomerName() ?>" />
</div>
<script type="text/x-magento-init">
 {
   "#vue-block-example": {
     "vueapp": {
       "components": [
         "HelloVueWidget"
       ]
     }
   }
 }
</script>
```

This example introduces a simple greeting component that reads a prop from PHP. The component should look like this:

```vue
<template>
  <h5>Hello {{name}}! Welcome to our store.</h5>
</template>

<script>
export default {
  props: [ 'name' ]
};
</script>
```

We will register this component as `HelloVueWidget` inside `requirejs-config.js`:

```javascript
// File: view/frontend/requirejs-config.js

var config = {
  map: {
    '*': {
      'HelloVueWidget': 'Vue_Widget/js/components/HelloVueWidget'
    }
  }
};
```

The block class can be used to initialize any values that need to be provided to your component.

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

Vue blocks are just regular `.phtml` blocks so they are included using the standard layout system:

```xml
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

### Data provider

There will be times that you'll need to pass data to a component as an array (or an object). Encoding them as props might work at first but it's kind of cumbersome. In order to pass complex data to a component we'll use a *data provider*. A *data provider* is a form of *dependency injection* that will allow you to share a set of data across all components within a block. This object will be generated whenever you set a `provider` property on the `vueapp` initializer.

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
            'Glasses',
            'Shoes'
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

In order to access the injected values, we use the `get()` method on the `$provider` property:

```vue
export default {
  mounted() {
    const { categories, author } = this.$provider.get();
  }
};
```

You could also pass the property key, which also support nested paths.

```javascript
// Single key
const categories = this.$provider.get('categories'); // [ 'Pants', 'T-Shirts', ... ]

// Nested path
const role = this.$provider.get('author.role'); // "Developer"
```

### Placeholders

Vue blocks can include a placeholder within their layout to provide a temporal UI. These  will be removed automatically once the component is initialized. Placeholder elements have the following properties:

 * They need to set their `role` attribute to `placeholder`.
 * They must be a direct child of the app container.
 
```html
<div id="placeholder-example">
    <h3 role="placeholder">Loading...</h3>
    <my-component></my-component>
</div>
<script type="text/x-magento-init">
 {
   "#placeholder-example": {
     "vueapp": {
       "components": [ "MyVueWidget" ]
     }
   }
 }
</script>
```

### Importing Magento modules

[TODO]

### Component libraries

Another clever technique is putting all you components within a single file. This is useful for cases when you are reusing a lot of components on different pages. A library script would look like this:

```javascript
// File: assets/frontend/lib.js

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
    input: './assets/frontend/lib.js',
    output: {
      file: './view/frontend/web/js/lib.js',
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
      'Fancy_Lib: 'Vue_Widget/js/lib'
    }
  }
};
```

In order to retrieve the components within a library we'll add a special syntax element to the mix. To retrieve the `FancyButton` component from `Fancy_Lib` we'll write `Fancy_Lib::FancyButton`. This rule applies both to widgets and apps.

## License

Vue.js is copyrighted by Evan You and distributed under the terms of the MIT license. Everything else included on this repo is distributed under the MIT license.
