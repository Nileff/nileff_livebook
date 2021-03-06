'use strict';

var React = require('react'),
	ReactDOM = require('react-dom'),
	QuillToolbar = require('./toolbar'),
	QuillMixin = require('./mixin'),
	T = React.PropTypes;

// FIXME: Remove with the switch to JSX
QuillToolbar = React.createFactory(QuillToolbar);

var QuillComponent = React.createClass({

	displayName: 'Quill',

	mixins: [ QuillMixin ],

	propTypes: {
		id: T.string,
		className: T.string,
		style: T.object,
		value: T.string,
		defaultValue: T.string,
		readOnly: T.bool,
		modules: T.object,
		toolbar: T.oneOfType([ T.array, T.oneOf([false]), ]),
		formats: T.array,
		styles: T.oneOfType([ T.object, T.oneOf([false]) ]),
		theme: T.string,
		pollInterval: T.number,
		onKeyPress: T.func,
		onKeyDown: T.func,
		onKeyUp: T.func,
		onChange: T.func,
		onChangeSelection: T.func
	},

	/*
	Changing one of these props should cause a re-render.
	*/
	dirtyProps: [
		'id',
		'className',
		'modules',
		'toolbar',
		'formats',
		'styles',
		'theme',
		'pollInterval'
	],

	getDefaultProps: function() {
		return {
			className: '',
			theme: 'base',
			modules: {
				'image-tooltip': true
			}
		};
	},

	/*
	We consider the component to be controlled if
	whenever `value` is bein sent in props.
	*/
	isControlled: function() {
		return 'value' in this.props;
	},

	getInitialState: function() {
		return {
			value: this.isControlled()
				? this.props.value
				: this.props.defaultValue
		};
	},

	componentWillReceiveProps: function(nextProps) {
		var editor = this.state.editor;
		// If the component is unmounted and mounted too quickly
		// an error is thrown in setEditorContents since editor is
		// still undefined. Must check if editor is undefined
		// before performing this call.
		if (editor) {
			// Update only if we've been passed a new `value`.
			// This leaves components using `defaultValue` alone.
			if ('value' in nextProps) {
				// NOTE: Seeing that Quill is missing a way to prevent
				//       edits, we have to settle for a hybrid between
				//       controlled and uncontrolled mode. We can't prevent
				//       the change, but we'll still override content
				//       whenever `value` differs from current state.
				if (nextProps.value !== this.getEditorContents()) {
					this.setEditorContents(editor, nextProps.value);
				}
			}
			// We can update readOnly state in-place.
			if ('readOnly' in nextProps) {
				if (nextProps.readOnly !== this.props.readOnly) {
					this.setEditorReadOnly(editor, nextProps.readOnly);
				}
			}
		}
	},

	componentDidMount: function() {
		var editor = this.createEditor(
			this.getEditorElement(),
			this.getEditorConfig());

		this.setCustomFormats(editor);

		// NOTE: Custom formats will be stripped when creating
		//       the editor, since they are not present there yet.
		//       Therefore, we re-set the contents from state.
		this.setState({ editor:editor }, function() {
			this.setEditorContents(editor, this.state.value);
		}.bind(this));
	},

	componentWillUnmount: function() {
		this.destroyEditor(this.state.editor);
		// NOTE: Don't set the state to null here
		//       as it would generate a loop.
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		// Check if one of the changes should trigger a re-render.
		for (var i=0; i<this.dirtyProps.length; i++) {
			var prop = this.dirtyProps[i];
			if (nextProps[prop] !== this.props[prop]) {
				return true;
			}
		}
		// Never re-render otherwise.
		return false;
	},

	/*
	If for whatever reason we are rendering again,
	we should tear down the editor and bring it up
	again.
	*/
	componentWillUpdate: function() {
		this.componentWillUnmount();
	},

	componentDidUpdate: function() {
		this.componentDidMount();
	},

	setCustomFormats: function (editor) {
		if (!this.props.formats) {
			return;
		}

		for (var i = 0; i < this.props.formats.length; i++) {
			var format = this.props.formats[i];
			editor.addFormat(format.name || format, format);
		}
	},

	getEditorConfig: function() {
		var config = {
			readOnly:     this.props.readOnly,
			theme:        this.props.theme,
			// Let Quill set the defaults, if no formats supplied
			formats:      this.props.formats ? [] : undefined,
			styles:       this.props.styles,
			modules:      this.props.modules,
			pollInterval: this.props.pollInterval
		};
		// Unless we're redefining the toolbar, or it has been explicitly
		// disabled, attach to the default one as a ref.
		if (this.props.toolbar !== false && !config.modules.toolbar) {
			// Don't mutate the original modules
			// because it's shared between components.
			config.modules = JSON.parse(JSON.stringify(config.modules));
			config.modules.toolbar = {
				container: ReactDOM.findDOMNode(this.refs.toolbar)
			};
		}
		return config;
	},

	getEditor: function() {
		return this.state.editor;
	},

	getEditorElement: function() {
		return ReactDOM.findDOMNode(this.refs.editor);
	},

	getEditorContents: function() {
		return this.state.value;
	},

	getEditorSelection: function() {
		return this.state.selection;
	},

	/*
	Renders either the specified contents, or a default
	configuration of toolbar and contents area.
	*/
	renderContents: function() {
		if (React.Children.count(this.props.children)) {
			// Clone children to own their refs.
			return React.Children.map(
				this.props.children,
				function(c) { return React.cloneElement(c, { ref: c.ref }) }
			);
		} else {
			return [
				// Quill modifies these elements in-place,
				// so we need to re-render them every time.

				// Render the toolbar unless explicitly disabled.
				this.props.toolbar !== false? QuillToolbar({
					key: 'toolbar-' + Math.random(),
					ref: 'toolbar',
					items: this.props.toolbar
				}) : false,

				React.DOM.div({
					key: 'editor-' + Math.random(),
					ref: 'editor',
					className: 'quill-contents book-text',
					dangerouslySetInnerHTML: { __html:this.getEditorContents() }
				})
			];
		}
	},

	onPaste: function(e){
		var clipboardData = e.clipboardData || window.clipboardData;
		if(navigator.appVersion.indexOf("MSIE")==-1){
			var pastedHtml = clipboardData.getData('text/html');
			if(pastedHtml.length > 0)
			{
				e.preventDefault();
				e.stopPropagation();

				pastedHtml = pastedHtml.replace(/<\/html>[\s\S]+/, "<\/html>");

				var originalHtml = document.createElement( 'html' );
				originalHtml.innerHTML = pastedHtml;

				console.dirxml(pastedHtml);

				var cleanHtml = this.clearHtml(originalHtml);

				console.dirxml(cleanHtml);

				document.execCommand("insertHTML", false, cleanHtml);
			}
		}
		else{
			var pastedText = clipboardData.getData('Text');
			console.log(pastedText);
			if(pastedText.length > 0)
			{
				e.preventDefault();
				e.stopPropagation();
				var sel, range, html;
				if (document.selection && document.selection.createRange) {
					document.selection.createRange().text = pastedText;
				}
				else if (window.getSelection) {
					sel = window.getSelection();
					if (sel.getRangeAt && sel.rangeCount) {
						range = sel.getRangeAt(0);
						range.deleteContents();
						range.insertNode( document.createTextNode(pastedText) );
					}
				}
			}
		}
	},

	clearHtml: function(originalHtml, full = true){

		var newEl = document.createElement( 'html' );
		newEl.appendChild(document.createElement( 'body' ));

		if(originalHtml.getElementsByTagName('body').length > 0 &&
			newEl.getElementsByTagName('body').length > 0){
			newEl.getElementsByTagName('body')[0].innerHTML =
				this.clearTag(originalHtml.getElementsByTagName('body')[0]);
		}

		if(full) {
			return newEl.outerHTML.replace(/[\r\n\t]+/g, ' ');
		}
		else{
			return newEl.getElementsByTagName('body')[0].innerHTML.replace(/[\r\n\t]+/g, ' ');
		}
	},

	clearTag: function(originalTag){
		if(originalTag.tagName) {
			if(/^(body|b|u|i|br)$/i.test(originalTag.tagName)) {
				var newTag = document.createElement(originalTag.tagName);
				newTag.innerHTML = originalTag.innerHTML;
				for (var i = 0; i < newTag.childNodes.length; i++) {
					var cleanTag = this.clearTag(newTag.childNodes[i]);
					var oldLen = newTag.childNodes.length;
					if(cleanTag === null){
						newTag.removeChild(newTag.childNodes[i]);
					}
					else if(cleanTag !== undefined) {
						newTag.childNodes[i].outerHTML = cleanTag;
					}
					i-=(oldLen - newTag.childNodes.length);
				}
				return newTag.outerHTML;
			}
			else if(/^(div|p|footer|h[1-6]|header|ul|li|ol|pre|samp|table)$/i.test(originalTag.tagName)) {
				var newTag = document.createElement("div");
				newTag.innerHTML = originalTag.innerHTML;
				newTag.style.textAlign = originalTag.style.textAlign;
				for (var i = 0; i < newTag.childNodes.length; i++) {
					var cleanTag = this.clearTag(newTag.childNodes[i]);
					var oldLen = newTag.childNodes.length;
					if(cleanTag === null){
						newTag.removeChild(newTag.childNodes[i]);
					}
					else if(cleanTag !== undefined) {
						newTag.childNodes[i].outerHTML = cleanTag;
					}
					i-=(oldLen - newTag.childNodes.length);
				}
				return newTag.outerHTML;
			}
			else if(/^(script|object|style|iframe|input|form)$/i.test(originalTag.tagName)) {
				return "";
			}
			else if (/^(img)$/i.test(originalTag.tagName)){
				var newTag = document.createElement(originalTag.tagName);
				newTag.src = originalTag.src;
				return newTag.outerHTML;
			}
			else {
				var newTag = document.createElement(originalTag.tagName);
				newTag.innerHTML = originalTag.innerHTML;
				for (var i = 0; i < newTag.childNodes.length; i++) {
					var cleanTag = this.clearTag(newTag.childNodes[i]);
					var oldLen = newTag.childNodes.length;
					if(cleanTag === null){
						newTag.removeChild(newTag.childNodes[i]);
					}
					else if(cleanTag !== undefined) {
						newTag.childNodes[i].outerHTML = cleanTag;
					}
					i-=(oldLen - newTag.childNodes.length);
				}
				return newTag.innerHTML;
			}
		}
		else{
			if(originalTag.nodeType == Node.TEXT_NODE
				&& originalTag.data.trim().length > 0)
				return undefined;
			return null;
		}
	},

	render: function() {
		return React.DOM.div({
			id: this.props.id,
			style: this.props.style,
			className: ['quill'].concat(this.props.className).join(' '),
			onKeyPress: this.props.onKeyPress,
			onKeyDown: this.props.onKeyDown,
			onKeyUp: this.props.onKeyUp,
			onChange: this.preventDefault,
			onPaste: this.onPaste
		},
			this.renderContents()
		);
	},

	onEditorChange: function(value, delta, source, editor) {
		var clearValue = value;
		if(clearValue && clearValue.length > 0) {
			var originalHtml = document.createElement('html');
			var body = originalHtml.appendChild(document.createElement('body'))
			body.innerHTML = clearValue;
			clearValue = this.clearHtml(originalHtml, false);
		}
		if (clearValue !== this.getEditorContents()) {
			this.setState({ value: clearValue });
			if (this.props.onChange) {
				this.props.onChange({text:clearValue}, delta, source, editor);
			}
		}
	},

	onEditorChangeSelection: function(range, source, editor) {
		var s = this.getEditorSelection() || {};
		var r = range || {};
		if (r.start !== s.start || r.end !== s.end) {
			this.setState({ selection: range });
			if (this.props.onChangeSelection) {
				this.props.onChangeSelection(range, source, editor);
			}
		}
	},

	focus: function() {
		this.state.editor.focus();
	},

	blur: function() {
		this.setEditorSelection(this.state.editor, null);
	},

	/*
	Stop change events from the toolbar from
	bubbling up outside.
	*/
	preventDefault: function(event) {
		event.preventDefault();
		event.stopPropagation();
	}

});

module.exports = QuillComponent;
