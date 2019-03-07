//Contains the information used for testing meta-polymer
window.OEUtils = window.OEUtils || {};
var OEUtils = window.OEUtils;

//cache to store meta data
OEUtils.metadataCache = OEUtils.metadataCache || {};

OEUtils.geturl = function (url) {
    return url;
}

//meta data for component `employee-form`
var masterMetadata = {
    'componentName': 'employee-form',
    'elements': {
        'dateOfBirth': {
            'uitype': 'oe-date',
            'format': 'DD-MM-YYYY'
        }
    },
    'modelName': 'Employee',
    'modelAlias': 'employee',
    'metadata': {
        'models': {
            'Employee': {
                'resturl': '/employees',
                'properties': {
                    'firstName': {
                        'type': 'string',
                        'required': true
                    },
                    'lastName': {
                        'type': 'string',
                        'required': true
                    },
                    'empId': {
                        'type': 'string',
                        'unique': true,
                        'required': true
                    },
                    'category': {
                        'type': 'combo',
                        'in': [
                            'L1',
                            'L2',
                            'L3'
                        ],
                        'listdata': [
                            'L1',
                            'L2',
                            'L3'
                        ]
                    },
                    'joiningDate': {
                        'type': 'date',
                        'required': true
                    },
                    'salary': {
                        'type': 'number',
                        'required': true,
                        'default': 100000
                    },
                    'priorExp': {
                        'type': 'number',
                        'min': 1,
                        'max': 50
                    },
                    'totalExp': {
                        'type': 'number'
                    },
                    'comments': {
                        'type': 'string',
                        'required': true,
                        'min': 20,
                        'max': 120
                    },
                    'bandApplicable': {
                        'type': 'boolean',
                        'default': true
                    },
                    'academics': {
                        'type': 'model',
                        'modeltype': 'Academics'
                    },
                    'skills': {
                        'type': 'tags',
                        'itemtype': 'string'
                    },
                    'rankings': {
                        'type': 'tags',
                        'itemtype': 'number'
                    },
                    'revisionDates': {
                        'type': 'tags',
                        'itemtype': 'date'
                    },
                    'addresses': {
                        'type': 'grid',
                        'itemtype': 'model',
                        'modeltype': 'Address',
                        'subModelMeta': {
                            'line1': {
                                'type': 'string',
                                'required': true
                            },
                            'city': {
                                'type': 'string'
                            },
                            'isCurrent': {
                                'type': 'boolean'
                            },
                            'stayingSince': {
                                'type': 'date'
                            }
                        }
                    },
                    'projectId': {
                        'type': 'typeahead',
                        'valueproperty': 'id',
                        'displayproperty': 'name',
                        'resturl': '/projects',
                        'searchurl': '/projects?filter[where][name][regexp]=/^SEARCH_STRING/i&filter[limit]=5',
                        'dataurl': '/projects/VALUE_STRING'
                    }
                }
            },
            'Academics': {
                'resturl': '/api/Academics',
                'properties': {
                    'graduation': {
                        'type': 'boolean',
                        'default': true
                    },
                    'matriculation': {
                        'type': 'boolean',
                        'default': true
                    },
                    'postGraduation': {
                        'type': 'boolean',
                        'default': false
                    },
                    'marks': {
                        'type': 'string',
                        'in': [
                            'cgpa',
                            'percentage',
                            'grade'
                        ]
                    }
                }
            },
            'Address': {
                'resturl': '/api/Addresses',
                'properties': {
                    'line1': {
                        'type': 'string',
                        'required': true
                    },
                    'city': {
                        'type': 'string'
                    },
                    'isCurrent': {
                        'type': 'boolean'
                    },
                    'stayingSince': {
                        'type': 'date'
                    }
                }
            },
            'Project': {
                'resturl': '/projects',
                'properties': {
                    'name': {
                        'type': 'string',
                        'required': true
                    }
                }
            },
            'Task': {
                'resturl': '/api/Tasks',
                'properties': {
                    'taskName': {
                        'type': 'string',
                        'required': true
                    },
                    'efforts': {
                        'type': 'number'
                    },
                    'startDate': {
                        'type': 'date',
                        'required': true
                    },
                    'employeeId': {
                        'type': 'objectid'
                    }
                }
            }
        },
        'resturl': '/employees',
        'properties': {
            'firstName': {
                'type': 'string',
                'required': true
            },
            'lastName': {
                'type': 'string',
                'required': true
            },
            'empId': {
                'type': 'string',
                'unique': true,
                'required': true
            },
            'category': {
                'type': 'combo',
                'in': [
                    'L1',
                    'L2',
                    'L3'
                ],
                'listdata': [
                    'L1',
                    'L2',
                    'L3'
                ]
            },
            'joiningDate': {
                'type': 'date',
                'required': true
            },
            'salary': {
                'type': 'number',
                'required': true,
                'default': 100000
            },
            'priorExp': {
                'type': 'number',
                'min': 1,
                'max': 50
            },
            'totalExp': {
                'type': 'number'
            },
            'comments': {
                'type': 'string',
                'required': true,
                'min': 20,
                'max': 120
            },
            'bandApplicable': {
                'type': 'boolean',
                'default': true
            },
            'academics': {
                'type': 'model',
                'modeltype': 'Academics'
            },
            'skills': {
                'type': 'tags',
                'itemtype': 'string'
            },
            'rankings': {
                'type': 'tags',
                'itemtype': 'number'
            },
            'revisionDates': {
                'type': 'tags',
                'itemtype': 'date'
            },
            'addresses': {
                'type': 'grid',
                'itemtype': 'model',
                'modeltype': 'Address',
                'subModelMeta': {
                    'line1': {
                        'type': 'string',
                        'required': true
                    },
                    'city': {
                        'type': 'string'
                    },
                    'isCurrent': {
                        'type': 'boolean'
                    },
                    'stayingSince': {
                        'type': 'date'
                    }
                }
            },
            'projectId': {
                'type': 'typeahead',
                'valueproperty': 'id',
                'displayproperty': 'name',
                'resturl': '/projects',
                'searchurl': '/projects?filter[where][name][regexp]=/^SEARCH_STRING/i&filter[limit]=5',
                'dataurl': '/projects/VALUE_STRING'
            }
        }
    },
    'autoInjectFields': true
};

masterMetadata.fields = [
    {
        fieldId: 'firstName',
        label: 'Employee First Name',
        tooltip: {
            "msgid": "firstName",
            "defaultValue": "Enter First Name"
        },
        container: 'main'
    }, {
        fieldId: 'category',
        container: 'missing'
    }, 'salary','addresses.line1', {
        fieldId: 'skills',
        'data-obj-attribute': {
            y: 'test'
        }
    }, {
        uitype: 'oe-info',
        label: 'Custom Field',
        value: 'Custom Value',
        'data-info-attribute': 'test'
    }];
masterMetadata.excludeFields = ['comments'];
masterMetadata.oeValidations = [
    {
        type: 'oe-eq-validator',
        fields: ['pf', 'reenter_pf'],
        error: 'fields-should-be-equal'
    }, {
        type: 'oe-ne-validator',
        fields: ['firstName', 'lastName'],
        error: 'fields-should-not-be-equal'
    }, {
        type: 'oe-lt-validator',
        fields: ['dateOfBirth', 'joiningDate'],
        error: 'dob-should-be-less-than-joining-date'
    }, {
        type: 'oe-le-validator',
        fields: ['priorExp', 'totalExp'],
        error: 'prior-exp-should-be-less-or-equal-to-total-exp'
    }, {
        type: 'oe-expression-validator',
        fields: ['firstName', 'lastName'],
        expression: '(!firstName || firstName.length>3) && (!lastName || lastName.length>6)',
        error: 'expression-validation-failed'
    }, {
        type: 'oe-combination-validator',
        fields: ['bandApplicable', 'totalExp', 'priorExp'],
        combinations: [{
            bandApplicable: true
        }, {
            bandApplicable: false,
            totalExp: 10,
            priorExp: 5
        }],
        error: 'combination-validation-failed'
    }, {
        type: 'oe-async-validator',
        fields: ['projectId'],
        requesturl: '/projects/[[employee.projectId]]',
        error: 'invalid-project-id'
    }];

masterMetadata.container = {
    "target": "#main",
    "nodeType": "div",
    "nodeAttributes": {
        "class": "dynamic-container"
    },
    "steps": [
        {
            "id": "container-1",
            "nodeType": "paper-card"
        },
        {
            "id": "container-3",
            "target": "#fields"
        },
        {
            "id": "container-2",
            "nodeAttributes": {
                "class": "custom-container"
            }
        }
    ]
}
masterMetadata.content = '<oe-field data-content="true" field-id="revisionDates"></oe-field><oe-block-validator  oe-container="main"><oe-field data-content="true" field-id="dateOfBirth"></oe-field> </oe-block-validator><oe-field data-content="true" oe-container="another" field-id="rankings"></oe-field>';

OEUtils.metadataCache['employee-form'] = masterMetadata;

//meta data for component `employee-expressions-form`

var expressionsMeta = JSON.parse(JSON.stringify(masterMetadata));
expressionsMeta.fields = [{
    fieldId: 'lastName',
    disabled: '!{{@i.firstName}}'
}, {
    fieldId: 'dateOfBirth',
    required: '{{@i.firstName}} && {{@i.firstName}}.length>0 && {{@i.lastName}} && {{@i.lastName}}.length>0'
}, {
    fieldId: 'salary',
    precision: '{{@i.firstName}}?{{@i.firstName}}.length:2'
}, {
    fieldId: 'bandApplicable',
    class: '({{@i.salary}}>50000)?"visible":"hidden"'
}, {
    fieldId: 'firstName',
    class: '[[getCSSClass({{@i.salary}},{{is}})]]'
}, {
    fieldId: 'pf',
    value: '0.12 * {{@i.salary}}'
}, {
    fieldId: 'detail.document',
    type:'documentdata',
    value: '0.12 * {{@i.salary}}'
}];

OEUtils.metadataCache['employee-expressions-form'] = expressionsMeta;

//Type Mappings 
window.OEUtils.TypeMappings = window.OEUtils.TypeMappings || {};
window.OEUtils.TypeMappings.string = {
    type: 'string',
    uiType: 'oe-input',
    attributes: [{
        'name': 'data-txt-attribute',
        'value': 'some-value'
    }, {
        'name': 'data-obj-attribute',
        'value': {
            x: 1
        }
    }]
};
window.OEUtils.TypeMappings.tags = {
    type: 'tags',
    uiType: 'oe-paper-chip',
    attributes: [{
        'name': 'data-txt-attribute',
        'value': 'some-value'
    }, {
        'name': 'data-obj-attribute',
        'value': {
            x: 1
        }
    }]
};