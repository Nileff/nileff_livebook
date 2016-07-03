'use strict';

var React = require('react'),
	ReactDOMServer = require('react-dom/server'),
	T = React.PropTypes;

var defaultItems = [

	{ label:'Formats', type:'group', items: [
		{ label:'Выравнивание', type:'align', items: [
			{ label:'', value:'justify', selected:true },
			{ label:'', value:'left' },
			{ label:'', value:'center' },
			{ label:'', value:'right' }
		]}
	]},

	{ label:'Text', type:'group', items: [
		{ type:'bold', label:'Жирный' },
		{ type:'italic', label:'Наклонный' },
		{ type:'underline', label:'Подчеркнутый' },
	]},

	{ label:'Blocks', type:'group', items: [
		{ type:'image', label:'Изображение' }
	]}

];

var QuillToolbar = React.createClass({

	displayName: 'Quill Toolbar',

	propTypes: {
		id:        T.string,
		className: T.string,
		items:     T.array
	},

	getDefaultProps: function(){
		return {
			items: defaultItems
		};
	},

	renderSeparator: function(key) {
		return React.DOM.span({
			key: key,
			className:'ql-format-separator'
		});
	},

	renderGroup: function(item, key) {
		return React.DOM.span({
			key: item.label || key,
			className:'ql-format-group' },
			item.items.map(this.renderItem)
		);
	},

	renderChoiceItem: function(item, key) {
		return React.DOM.option({
			key: item.label || item.value || key,
			value:item.value,
			selected:item.selected },
			item.label
		);
	},

	renderChoices: function(item, key) {
		return React.DOM.select({
			key: item.label || key,
			title: item.label,
			className: 'ql-'+item.type },
			item.items.map(this.renderChoiceItem)
		);
	},

	renderAction: function(item, key) {
		return React.DOM.span({
			key: item.label || item.value || key,
			className: 'ql-format-button ql-'+item.type,
			title: item.label },
			item.children
		);
	},

	renderItem: function(item, key) {
		switch (item.type) {
			case 'separator':
				return this.renderSeparator(key);
			case 'group':
				return this.renderGroup(item, key);
			case 'font':
			case 'align':
			case 'size':
			case 'color':
			case 'background':
				return this.renderChoices(item, key);
			default:
				return this.renderAction(item, key);
		}
	},

	getClassName: function() {
		return 'quill-toolbar ' + (this.props.className||'');
	},

	render: function() {
		var children = this.props.items.map(this.renderItem);
		var html = children.map(ReactDOMServer.renderToStaticMarkup).join('');
		return React.DOM.div({
			className: this.getClassName(),
			dangerouslySetInnerHTML: { __html:html }
		});
	}

});

module.exports = QuillToolbar;
QuillToolbar.defaultItems = defaultItems;
