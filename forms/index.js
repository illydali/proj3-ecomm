// import in caolan forms
const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

var bootstrapFieldCol6 = function (name, object) {
    if (!Array.isArray(object.widget.classes)) {
        object.widget.classes = [];
    }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group col col-6">' + label + widget + error + '</div>';
};

const createRecordForm = (genres, labels, artists) => {
    return forms.create({
        'title': fields.string({
            required: true,
            errorAfterField: true
        }),
        'label_id': fields.string({
            label: 'Record Label',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: labels
        }),
        'artist_id': fields.string({
            label: 'Artist',
            required: true,
            errorAfterField: true,
            widget: widgets.select(),
            choices: artists
        }),
        'price': fields.string({
            required: true,
            errorAfterField: true,
            'validators': [validators.integer(), validators.min(0)]
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true
        }),
        'release_date': fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.date()
        }),
        'stock': fields.string({
            required: true,
            errorAfterField: true,
            'validators': [validators.integer(), validators.min(0)]
        }),
        'record_size': fields.string({
            required: true,
            errorAfterField: true,
            'validators': [validators.integer(), validators.min(0)]
        }),
        'speed': fields.string({
            required: true,
            errorAfterField: true,
            'validators': [validators.integer(), validators.min(0)]
        }),
        'type': fields.string({
            required: true,
            errorAfterField: true
        }),
        'genres': fields.string({
            label: 'Genre',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: genres
        }),
        // 'styles': fields.string({
        //     label: 'Style',
        //     required: false,
        //     errorAfterField: false,
        //     widget: widgets.multipleSelect(),
        //     choices: styles
        // }),
        'image_url': fields.string({
            widget: widgets.hidden()
        })
    })
}

const createArtistForm = () => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
        }),
        'about': fields.string({
            required: true,
            errorAfterField: true
        })
    })
}

const createRegisterForm = () => {
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true
        }),
        'confirm_password': fields.password({
            required: true,
            errorAfterField: true,
            validators: [validators.matchField('password')]
        })
    })
}

const userLoginForm = () => {
    return forms.create({
        'email': fields.string({
            'required': true,
            'errorAfterField': true,
        }),
        'password': fields.password({
            'required': true,
            'errorAfterField': true
        })
    })
}

const createSearchForm = (labels, genres) => {
    return forms.create({
        'title': fields.string({
            required: false,
            errorAfterField: true,
        }),
        // 'min_price': fields.string({
        //     required: false,
        //     errorAfterField: true,
        //     validators: [validators.integer(), validators.min(0)]
        // }),
        // 'max_price': fields.string({
        //     required: false,
        //     errorAfterField: true,
        //     validators: [validators.integer(), validators.min(0)]
        // }),
        'label_id': fields.string({
            label: 'Record Label',
            required: false,
            errorAfterField: true,
            widget: widgets.select(),
            choices: labels
        }),
        'genres': fields.string({
            label: 'Genre',
            required: false,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: genres
        }),
    })
}

const updateStatusForm = (status) => {
    return forms.create({
        "status_id": fields.string({
            label: "Status",
            required: true,
            errorAfterField: true, 
            cssClasses: {
                label: ["form-label"],
            },
            widget : widgets.select(),
            choices: status
        }),
    })
}
module.exports = {
    createRecordForm,
    createArtistForm,
    createRegisterForm,
    userLoginForm,
    createSearchForm,
    updateStatusForm,
    bootstrapField,
    bootstrapFieldCol6
}