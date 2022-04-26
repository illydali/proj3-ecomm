// import in caolan forms
const forms = require("forms");
const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

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

const createNewRecord = (genres, labels) => {
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
        'price': fields.string({
            required: true,
            errorAfterField: true,
            'validators':[validators.integer(), validators.min(0)]
        }),
        'description' : fields.string({
            required: true,
            errorAfterField: true
        }),
        'release_date' : fields.string({
            required: true,
            errorAfterField: true,
            widget: widgets.date()
        }),
        'stock' : fields.string({
            required: true,
            errorAfterField: true,
            'validators':[validators.integer(), validators.min(0)]
        }),
        'record_size' : fields.string({
            required: true,
            errorAfterField: true,
            'validators':[validators.integer(), validators.min(0)]
        }),
        'speed' : fields.string({
            required: true,
            errorAfterField: true,
            'validators':[validators.integer(), validators.min(0)]
        }),
        'type' : fields.string({
            required: true,
            errorAfterField: true
        }),
        'main_image' : fields.string({
            // add required true here later   ! important
            
        }),
        'genres' : fields.string({
            label: 'Genre',
            required: true,
            errorAfterField: true,
            widget: widgets.multipleSelect(),
            choices: genres
        }),
    })
}

module.exports = { createNewRecord, bootstrapField }