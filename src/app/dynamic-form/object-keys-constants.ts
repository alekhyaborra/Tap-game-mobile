export  class  widgetKeys {
    public static keys =  {
       label : "label",
       _id    : "id" ,
       disabled:"disabled",
       placeholder : "placeholder",
       options:"options",
       optionDisplayName:"displayValue",
       isRequired :"isRequired",
       minLength:"minLength",
       maxLength:"maxLength",
       maximum:"maximum",
       minimum:"minimum",
       isUnderHeading : "isUnderHeading",
       breakOf:"breakOf",
       defaultValue:"defaultValue",
       dependentField:"isDependentField",
       allowDecimals:"isInptAllowDecimals",
       readonly:"readOnly",
       type:"type",
       maxDate:"maxDate",
       minDate:"minDate",
       dateType:"typeOfDateSelected",
       isAllowMultiselection: "isAllowMultiselection",
       videoDuration: "videoDuration",
       vidoeSize:"vidoeSize",
       derivedField:"derivedField",
       isTable: "isTable",
       maxTime:"maxTime",
       minTime:"minTime",
       timePeriod:"timePeriod",
       dynamicDropdownTable: 'dynamicDropdownTable',
       columnName: 'columnName',
       isGeotagginEnable: 'isGeotagginEnable',
       isAllowDecimal: "isAllowDecimal",
       referenceListOptions:"referenceListOptions",
       optionValue:"value",

    }
    
    public static calculationKeys = {
        formula:"formula",
        fieldList:"fieldList",
        operator:"operator",
        actions: {
            add: 'add',
            numeric: 'numeric',
            sub: 'sub',
            mul: 'mul',
            div: 'div',
            inv: 'inv',
            singleOperator: 'singleOperator',
            sqrt: 'sqrt',
            parentheses: '(',
            avg: 'avg'
        },
        formulaKeys: {
            id:"id"
        }

    }

    public static dataTypes = {
        object:'object',
        string:"string"
    }

    public static fieldTypes = {
        select: "select",
        heading: "heading",
        break: "break",
        rating: "rating",
        table:"table",
        referenceList:"referenceList",
        textbox: "textBox",
        number: "number",
        radio: "radio",
        checkbox: "checkBox",
        textarea: "textArea"
    }

    public static dependFields = {
        dependFields:"dependFields",
        Show:"Show",
        Hide:"Hide",
        Readonly :"Readonly"
    }

    public static userproperties = {
        divisionCode:"Division Code",
        number:"Phone Number",
        email:"Email",
        name:"Requestor Name"
    }
    
} 
