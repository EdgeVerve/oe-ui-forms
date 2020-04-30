# \<meta-polymer\>

`<meta-polymer>` is wrapper around `Polymer` which allows the user to inject new components into the template or modify the existing components in the template using a `UIComponent` service endpoint provided by `oe.io` based on user requirements.

`<meta-polymer>` supports generation, enrichment and personalization of polymer component using meta data definition. Metadata enablement is done using models

* UIComponent
* UIElement
* TypeMapping

# \<oe-validators\>

`<oe-validators>` provides a collection of elements for validation of forms.

This repo consists of the following validator elements

* oe-async-validator
* oe-block-validator
* oe-combination-validator
* oe-eq-validator
* oe-expression-validator
* oe-le-validator
* oe-lt-validator
* oe-ne-validator

### oe-block-validator
`oe-block-validator` provides a validation section to validate a subset of fields on form.

```html
<oe-block-validator>
    <oe-vbox>
        <paper-input label="First Name"></paper-input>
        <paper-input label="Last Name"></paper-input>
        <paper-input label="City"></paper-input>
        <paper-input label="Zip Code"></paper-input>
    </oe-vbox>
<oe-block-validator>
```

### oe-combination-validator
`oe-combination-validator` evaluates fields on the bound `model` and ensures the combination is one of the defined `combinations`.

### oe-eq-validator
`oe-eq-validator` evaluates values of two fields on the bound `model` to make sure they are equal/same.

### oe-expression-validator
`oe-expression-validator` evaluates an `expression` on the bound `model` to decide the model validity.

### oe-le-validator
`oe-le-validator` evaluates values of two fields on the bound `model` to make sure value of first field (fields[0]) is less-than-or-equal-to the second field (fields[1]).

### oe-lt-validator
`oe-lt-validator` evaluates values of two fields on the bound `model` to make sure value of first field (fields[0]) is less-than second field (fields[1]).

### oe-ne-validator
`oe-ne-validator` evaluates values of two fields on the bound `model` to make sure they are *not* same.


UIComponent
-------------
The new framework model `UIComponent` allows 
1. Metadata enablement of handwritten form
2. Auto generation of Model Form

It has following properties:

Property          | Required | Default |         Description
------------------|----------|---------|----------------------------
`name`            | yes      |    -    | name of UI component, matches Polymer proptotype.is property
`templateName`    | no       |    -    | Based on templateName component is generatred
`filePath`        | no       |    -    | If component is file based, file location
`content`         | no       |    -    | html content of the component, if not stored it is generated from model metadata
`modelName`       | no       |    -    | If this component renders default UI for a model then model name
`fields`          | no       |    -    | fields of default model to be rendered
`gridConfig`      | no       |    -    | fields to display in grids
`autoInjectFields`| no       |    -    | Whether remaining model fields should be auto injected or not
`excludeFields`   | no       |    -    | Fields which are to be excluded from injection


### Enable metadata enrichment of handwritten Polymer element

1. Post an entry in `UIComponent` as below:

```json
{
    "name":"my-owesome-element",
    "filePath":"/path/to/my-owesome-element.js"
}
```

2. Replace `Polymer` call in your element with `MetaPolymer`

3. Replace your client side import statement

```html
<link rel="import" href="/path/to/my-owesome-element.html">

with

<link rel="import" href="/components/my-owesome-element.html">
```

This will enable `my-owesome-element` to be dynamically enriched at runtime using `UIElement` defined for 
this component.

### Auto generate model form

Lets take the second use case to auto-generate data entry form for a particular model, say `Apprentice`
defined as below:

```json
{
	"name": "Apprentice",
	"idInjection": true,
	"properties": {
		"name": {
			"type": "string",
			"required": true
		},
		"email": {
			"type": "email",
			"required": false
		},
		"dateOfBirth": {
			"type": "date",
			"required": true
		},
		"stipend": {
			"type": "number",
			"required": false
		},
		"primarySkill": {
			"type": "string",
            "refcodetype":"SkillCode",
			"required": true
		},
		"language": {
			"type": "string",
			"required": true,
            "in":["Chinese","English","French","Hindi","Hebrew"]
		},
		"nationality": {
			"type": "string",
			"enumtype": "NationalityEnum",
			"required": false
		},
		"elligible": {
			"type": "boolean",
			"required": false,
			"default": false
		},
		"interests": {
			"type": [
				"string"
			]
		},
		"fromTime": {
			"type": "timestamp"
		},
		"toTime": {
			"type": "timestamp"
		}
	},
	"validations": [],
	"relations": {
		"experienceDetails": {
			"type": "hasMany",
			"model": "ExperienceData"
		},
		"department": {
			"type": "belongsTo",
			"model": "Department"
		}
	},
	"acls": [],
	"methods": {}
}

```

1. Define UI Routes
We create two `UIRoute` entries. First one displays list of `Apprentice` and the second one shows a form for 
editing a particular `Apprentice` record.

(Note that below route definition are generic) 

```json
[
  {
    "type": "elem",
    "name": "elem",
    "path": "/ui/:modelName",
    "import": "elements/model-ui-generator.html",
    "args" : {"viewType":"list"}
  },
  {
    "type": "elem",
    "name": "elem",
    "path": "/ui/:modelName/:modelId",
    "import": "elements/model-ui-generator.html",
    "args" : {"viewType":"form"}
  }
]
```


2. Create the Navigation Link to navigate to the `Apprentice` list

```json
{
    "name": "ApprenticeList",
    "url": "/ui/apprentice",
    "label": "Apprentice",
    "icon": "social:person",
    "group": "root",
    "topLevel":true,
    "sequence":5
}
```


2. Finally define `UIElement`:

We create two `UIElement` entries one each for showing list of `Apprentice` and for `Apprentice` form.

```json
[
    {
        "name": "apprentice-form",
        "modelName": "Apprentice",
        "content" : "<ev-fields tplid='main' list='firstName,lastName'> </ev-fields><ev-fields tplid='details' list='birthDate,annualIncome'></ev-fields> ",
        "templateName": "default-form.js",
        "autoInjectFields" : true,
        "excludeFields" : ["nationality", "profession"]
    },
    {
        "name": "apprentice-list",
        "modelName": "Apprentice",
        "templateName": "default-list.js",
        "autoInjectFields" : false,
        "gridConfig" : {"modelGrid":[{"key":"firstName","label":"Custom Title"},"lastName","language","birthDate"]}
    }
]
```

`default-list.js` and `default-form.js` are the templates defined for generated elements.

### Defining templates

Defining and writing a new template is just like writing a Polymer component with following specifics:

You can use (:componentName, :modelName, :modelAlias, :plural) as placeholders which are replaced with actual
values.


```html
<dom-module id=":componentName">
  <template>
    <style>

    </style>
    <div class="content layout vertical">
      <div class="evform layout vertical">
        <div class="layout horizontal">
          <h2 class="flex">:modelName</h2>
          <div>
              <template is="toolbar"></template>
            <paper-button raised primary on-tap="doSave" ev-action-model=":modelAlias">Save</paper-button>
            <paper-button raised on-tap="doClear" ev-action-model=":modelAlias">Clear</paper-button>
            <template is="dom-if" if="{{:modelAlias.id}}">
              <paper-button raised on-tap="doFetch">Reset</paper-button>
              <paper-button raised on-tap="doDelete" ev-action-model=":modelAlias">Delete</paper-button>
            </template>
          </div>
        </div>
        <div id="fields" class="layout horizontal wrap">
        </div>
        <div id="grids" class="layout vertical">
        </div>
      </div>
    </div>
  </template>
  <script>
 
  	MetaPolymer({
        is: ":componentName",
        properties : {
            :modelAlias : {
              type : 'object',
              notify : true,
              value : {}
            }
        },
        behaviors:[EV.FormValidationBehavior,EV.ModelHandler]
    });
        
    </script>
</dom-module>
```



### Mechanics of form rendering

#### As part of server's response to UIMetadata request, following steps take place:

- UIMetadata record, corresponding to the requested 'code' that matches user's call context is selected.
- If the record has 'modeltype' property defined, corresponding model definition along with its properties and relationships is loaded.
- If controls have source property defined, these definitions are loaded from 'Field' collection.
- Finally controls properties are enriched as follows,
    - Value defined directly in UIMetadata control gets preference
    - Followed by source 'Field'
    - Lastly any value defined on the model are applied.
- However, for validations 'strictest-of-all' rules are applied.
	- If a property is defined as `required` on model, it can not be overridden to `required=false`.
	- Maximum of `minlength/min` and minimum of `maxlength/max` property is used.
	- If a property has a validateWhen condition for any of the validation rules that rule is not applied in the generated form for that property.In this case the server takes care of the validateWhen condition while we save the form data.
- Properties that are defined on model but are not listed in 'controls' array are added with defaults. The defaults are arrived using field-source (where source-key=model-property-name) and property settings defined at model level.

- `default` specified on all controls/source-field/model are used to form the default-view-model object as part of response.
- All boolean properties assume a default value of 'false' unless specified otherwise.


#### Rendering the form on client side

As explained above for UIRoute type 'meta', the final rendered form takes uimetadata name along with form-template as an input. 

- To render a metadata driven form or page, the metadata and html form-template are pulled from server.
- Each control defined in metadata is added to its corresponding container in form-template that bears `ev-container="container-name"` attribute. i.e. a control with `container:'main'` is added to 
an html container in template (div, ev-vbox, ev-hbox etc.) that has `ev-container="main"` attribute value.
- If the corresponding container is not found, the control is appended in the end.

#### Form Navigation handling

- `ev-selection-group='tabs'`
> - The form-template may have `<iron-pages>` linked to `paper-tabs`. Handling of `selected` tab is required as default value for `selected` has to be set to 0 so that first tab is visible by default.

>  - This can be achieved by setting `ev-selection-group="mytabs"` on both paper-tabs and iron-pages. The form rendering automatically binds paper-tabs and iron-pages to a single property with default as 0, there by showing first tab as default.

- `ev-<group>-next` and `ev-<group>-prev`
>	The form can also be some kind of wizard form where one iron-page is displayed at a time and user can click next/prev to browse through steps.
>For `<iron-pages ev-selection-group='mywizardform'>`,
> - Add an icon, button, paper-fab and give attribute as `ev-mywizardform-next` to auto handle 'next' action.
> - Add an icon, button, paper-fab and give attribute as `ev-mywizardform-prev` to auto handle 'prev' action.


#### Form action handling

`ev-action=[new,save,delete,reset,refresh]`

- ev-action="new" resets the VM with `defaultVM`
- ev-action="reset", resets the VM with original values
- ev-action="refresh", pulls the latest data (corresponding to modelId) from server and sets as 'VM'
- ev-action="save", posts the current VM on the `resturl` 
- ev-action="delete", sends a `delete` request on the `resturl`

Completion of insert/update/delete/fetch raises following events
`ev-formdata-inserted, ev-formdata-updated, ev-formdata-deleted, ev-formdata-loaded`. These are default handled in `ev-app-shell` to display appropriate message toast.
            
#### Lazy data fetch

For cases where some extra data needs to be fetched from server you can use `ev-action="request-response"` as below

`<paper-fab icon="icons:fetch" 
                   ev-action="request-response"
                   request-url="/api/details"
                   response-to="extraDetails">
 </paper-fab>`

### UIMetadata Form without route change

`<ev-meta-component>`

