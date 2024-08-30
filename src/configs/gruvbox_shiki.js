import c from './gruvbox_colors.js';

export const theme = {
	name: 'gruvbox',
	colors: {
		// {{{
		'activityBar.background': '#1d2021',
		'activityBar.border': '#282828',
		'activityBar.dropBackground': '#1d2021',
		'activityBar.foreground': '#dfbf8e',
		'activityBarBadge.background': '#458588',
		'activityBarBadge.foreground': '#dfbf8e',
		'badge.background': '#d3869b',
		'badge.foreground': '#1d2021',
		'button.background': '#45858880',
		'button.foreground': '#dfbf8e',
		'button.hoverBackground': '#45858860',
		'debugToolBar.background': '#1d2021',
		'diffEditor.insertedTextBackground': '#8b955330',
		'diffEditor.insertedTextBorder': '#a8a81c00',
		'diffEditor.removedTextBackground': '#d75f5f30',
		'diffEditor.removedTextBorder': '#d75f5f00',
		'dropdown.background': '#1d2021',
		'dropdown.border': '#282828',
		'dropdown.foreground': '#dfbf8e',
		'editor.background': c.gruvdbg0,
		'editor.findMatchBackground': '#83a59870',
		'editor.findMatchHighlightBackground': '#e78a4e30',
		'editor.findRangeHighlightBackground': '#83a59870',
		'editor.foreground': '#dfbf8e',
		'editor.hoverHighlightBackground': '#689d6a50',
		'editor.lineHighlightBackground': '#28282860',
		'editor.lineHighlightBorder': '#28282800',
		'editor.selectionBackground': '#689d6a40',
		'editor.selectionHighlightBackground': '#cea64a40',
		'editorBracketMatch.background': '#92837480',
		'editorBracketMatch.border': '#1d202100',
		'editorCodeLens.foreground': '#a8998490',
		'editorCursor.foreground': '#dfbf8e',
		'editorError.foreground': '#d75f5f',
		'editorGroup.border': '#282828',
		'editorGroup.dropBackground': '#28282860',
		'editorGroupHeader.noTabsBackground': '#282828',
		'editorGroupHeader.tabsBackground': '#1d2021',
		'editorGroupHeader.tabsBorder': '#282828',
		'editorGutter.addedBackground': c.gruvdemphgreen,
		'editorGutter.background': '#1d202100',
		'editorGutter.deletedBackground': '#d75f5f',
		'editorGutter.modifiedBackground': '#83a598',
		'editorHoverWidget.background': '#1d2021',
		'editorHoverWidget.border': '#282828',
		'editorIndentGuide.activeBackground': '#a8998450',
		'editorIndentGuide.background': '#a8998420',
		'editorInfo.foreground': '#458588',
		'editorLineNumber.foreground': '#3c3836',
		'editorLink.activeForeground': '#dfbf8e',
		'editorOverviewRuler.addedForeground': '#83a598',
		'editorOverviewRuler.border': '#1d202100',
		'editorOverviewRuler.commonContentForeground': '#928374',
		'editorOverviewRuler.currentContentForeground': '#458588',
		'editorOverviewRuler.deletedForeground': '#83a598',
		'editorOverviewRuler.errorForeground': '#d75f5f',
		'editorOverviewRuler.findMatchForeground': '#bdae93',
		'editorOverviewRuler.incomingContentForeground': '#689d6a',
		'editorOverviewRuler.infoForeground': '#d3869b',
		'editorOverviewRuler.modifiedForeground': '#83a598',
		'editorOverviewRuler.rangeHighlightForeground': '#bdae93',
		'editorOverviewRuler.selectionHighlightForeground': '#3c3836',
		'editorOverviewRuler.warningForeground': '#d69617',
		'editorOverviewRuler.wordHighlightForeground': '#3c3836',
		'editorOverviewRuler.wordHighlightStrongForeground': '#3c3836',
		'editorRuler.foreground': '#a8998440',
		'editorSuggestWidget.background': '#1d2021',
		'editorSuggestWidget.border': '#282828',
		'editorSuggestWidget.foreground': '#dfbf8e',
		'editorSuggestWidget.highlightForeground': '#689d6a',
		'editorSuggestWidget.selectedBackground': '#282828',
		'editorWarning.foreground': '#d69617',
		'editorWhitespace.foreground': '#a8998420',
		'editorWidget.background': '#1d2021',
		'editorWidget.border': '#282828',
		errorForeground: '#d75f5f',
		'extensionButton.prominentBackground': '#8b955380',
		'extensionButton.prominentHoverBackground': '#8b955330',
		focusBorder: '#282828',
		foreground: '#dfbf8e',
		'gitDecoration.conflictingResourceForeground': '#b16286',
		'gitDecoration.deletedResourceForeground': '#d75f5f',
		'gitDecoration.ignoredResourceForeground': '#7c6f64',
		'gitDecoration.modifiedResourceForeground': '#d69617',
		'gitDecoration.untrackedResourceForeground': c.gruvdfg,
		'input.background': '#dfbf8e05',
		'input.border': '#282828',
		'input.foreground': '#dfbf8e',
		'input.placeholderForeground': '#dfbf8e60',
		'inputValidation.errorBackground': '#d75f5f80',
		'inputValidation.errorBorder': '#d75f5f',
		'inputValidation.infoBackground': '#45858880',
		'inputValidation.infoBorder': '#83a598',
		'inputValidation.warningBackground': '#d6961780',
		'inputValidation.warningBorder': '#cea64a',
		'list.activeSelectionBackground': '#28282880',
		'list.activeSelectionForeground': c.gruvdemphaqua,
		'list.dropBackground': '#282828',
		'quickInput.list.focusBackground': '#282828',
		'list.focusForeground': '#dfbf8e',
		'list.highlightForeground': '#689d6a',
		'list.hoverBackground': '#28282880',
		'list.hoverForeground': '#d5c4a1',
		'list.inactiveSelectionBackground': '#28282880',
		'list.inactiveSelectionForeground': '#689d6a',
		'merge.border': '#1d202100',
		'merge.currentContentBackground': '#45858820',
		'merge.currentHeaderBackground': '#45858840',
		'merge.incomingContentBackground': '#689d6a20',
		'merge.incomingHeaderBackground': '#689d6a40',
		'minimap.selectionHighlight': '#cea64a40',
		'icon.foreground': c.gruvdemphaqua,
		'panel.border': '#282828',
		'panelTitle.activeForeground': '#dfbf8e',
		'peekView.border': '#83a598',
		'peekViewEditor.background': '#282828',
		'peekViewEditor.matchHighlightBackground': '#83a59830',
		'peekViewEditorGutter.background': '#282828',
		'peekViewResult.background': '#28282890',
		'peekViewResult.fileForeground': '#dfbf8e',
		'peekViewResult.lineForeground': '#dfbf8e',
		'peekViewResult.matchHighlightBackground': '#87af8730',
		'peekViewResult.selectionBackground': '#83a59830',
		'peekViewResult.selectionForeground': c.gruvdemphaqua,
		'peekViewTitle.background': '#282828',
		'peekViewTitleDescription.foreground': '#bdae93',
		'peekViewTitleLabel.foreground': '#dfbf8e',
		'progressBar.background': '#689d6a',
		'scrollbar.shadow': '#14181a',
		'scrollbarSlider.activeBackground': '#689d6a',
		'scrollbarSlider.background': '#3c3836',
		'scrollbarSlider.hoverBackground': '#504945',
		'selection.background': '#689d6a80',
		'sideBar.background': '#1d2021',
		'sideBar.border': '#282828',
		'sideBar.foreground': '#d5c4a1',
		'sideBarSectionHeader.background': '#1d202100',
		'sideBarSectionHeader.foreground': '#dfbf8e',
		'sideBarTitle.foreground': '#dfbf8e',
		'statusBar.background': '#1d2021',
		'statusBar.border': '#282828',
		'statusBar.debuggingBackground': '#e78a4e',
		'statusBar.debuggingBorder': '#1d202100',
		'statusBar.debuggingForeground': '#1d2021',
		'statusBar.foreground': '#dfbf8e',
		'statusBar.noFolderBackground': '#1d2021',
		'statusBar.noFolderBorder': '#1d202100',
		'tab.activeBackground': '#282828',
		'tab.activeBorder': '#689d6a',
		'tab.activeForeground': '#dfbf8e',
		'tab.border': '#1d202100',
		'tab.inactiveBackground': '#1d2021',
		'tab.inactiveForeground': '#a89984',
		'tab.unfocusedActiveBorder': '#1d202100',
		'tab.unfocusedActiveForeground': '#a89984',
		'tab.unfocusedInactiveForeground': '#928374',
		'terminal.ansiBlack': '#282828',
		'terminal.ansiBlue': '#458588',
		'terminal.ansiBrightBlack': '#928374',
		'terminal.ansiBrightBlue': '#83a598',
		'terminal.ansiBrightCyan': c.gruvdemphaqua,
		'terminal.ansiBrightGreen': c.gruvdemphgreen,
		'terminal.ansiBrightMagenta': '#d3869b',
		'terminal.ansiBrightRed': '#d75f5f',
		'terminal.ansiBrightWhite': '#dfbf8e',
		'terminal.ansiBrightYellow': '#cea64a',
		'terminal.ansiCyan': '#689d6a',
		'terminal.ansiGreen': c.gruvdfg,
		'terminal.ansiMagenta': '#b16286',
		'terminal.ansiRed': '#d75f5f',
		'terminal.ansiWhite': '#a89984',
		'terminal.ansiYellow': '#d69617',
		'terminal.background': '#1d2021',
		'terminal.foreground': '#dfbf8e',
		'textLink.activeForeground': '#458588',
		'textLink.foreground': '#83a598',
		'titleBar.activeBackground': '#1d2021',
		'titleBar.activeForeground': '#dfbf8e',
		'titleBar.inactiveBackground': '#1d2021',
		'widget.shadow': '#14181a'
	}, // }}}
	tokenColors: [
		{
			scope: 'emphasis',
			settings: {
				fontStyle: 'italic'
			}
		},
		{
			scope: 'strong',
			settings: {
				fontStyle: 'bold'
			}
		},
		{
			scope: 'header',
			settings: {
				foreground: c.gruvblue
			}
		},
		{
			scope: ['comment', 'punctuation.definition.comment'],
			settings: {
				foreground: c.gruvgray,
				fontStyle: 'italic'
			}
		},
		{
			scope: [
				'constant.numeric',
				'constant.rgb-value',
				'constant.language.boolean',
				'constant.language.null',
				'constant.other.character-class.set.regexp'
			],
			settings: {
				foreground: c.gruvdemphpurple
			}
		},
		{
			scope: 'entity.name.selector',
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: 'meta.selector',
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: 'storage',
			settings: {
				foreground: c.gruvdemphorange
			}
		},
		{
			scope: 'storage.modifier',
			settings: {
				foreground: c.gruvdemphred
			}
		},
		{
			scope: ['string', 'string.regexp'],
			settings: {
				foreground: c.gruvdemphgreen
			}
		},
		{
			scope: 'object',
			settings: {
				foreground: '#00ff00'
			}
		},
		{
			name: 'URL',
			scope: ['*url*', '*link*', '*uri*'],
			settings: {
				fontStyle: 'underline'
			}
		},
		{
			scope: 'keyword',
			settings: {
				foreground: '#ff0000'
			}
		},
		{
			scope: 'keyword.control',
			settings: {
				foreground: c.gruvdemphred
			}
		},
		{
			scope: 'keyword.other',
			settings: {
				foreground: c.gruvdemphgreen
			}
		},
		{
			scope: [
				'keyword.control.anchor.regexp',
				'keyword.operator.quantifier.regexp',
				'constant.character.escape.backslash.regexp'
			],
			settings: {
				foreground: c.gruvdemphorange
			}
		},
		{
			scope: 'keyword.operator',
			settings: {
				foreground: c.gruvdfg4
			}
		},
		{
			scope: ['keyword.operator.new'],
			settings: {
				foreground: c.gruvdemphred
			}
		},
		{
			scope: ['support.class'],
			settings: {
				foreground: c.gruvdemphpurple
			}
		},
		{
			scope: [
				'meta.type.name',
				'meta.return.type',
				'meta.return-type',
				'meta.cast',
				'meta.type.annotation',
				'support.type',
				'storage.type',
				'variable.class',
				'variable.language.this'
				// 'variable.other.constant'
			],
			settings: {
				foreground: c.gruvdemphorange
			}
		},
		{
			scope: ['meta.object-literal.key'],
			settings: {
				foreground: c.gruvdemphgreen
			}
		},
		{
			scope: ['entity.name.function', 'support.function'],
			settings: {
				foreground: c.gruvdemphblue
			}
		},
		{
			name: 'Function declarations',
			scope: ['storage.type.function'],
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: [
				'storage.type.function.arrow',
				'entity.function',
				'entity.name.function.static'
			],
			settings: {
				foreground: c.gruvdemphyellow
			}
		},
		{
			scope: 'entity.name.function.function-call',
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: 'support.function.builtin',
			settings: {
				foreground: c.gruvdfg
			}
		},
		{
			name: 'variables',
			scope: [
				'meta.parameter.type.variable',
				'variable.parameter',
				'variable.other',
				'variable.name',
				'variable',
				'string.constant.other.placeholder'
			],
			settings: {
				foreground: c.gruvdfg
			}
		},
		{
			scope: 'storage.type.class',
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: ['punctuation.separator', 'punctuation.accessor'],
			settings: {
				foreground: c.gruvdfg4
			}
		},
		{
			scope: [
				'punctuation.definition.parameters',
				'punctuation.definition.block',
				'meta.brace.round'
			],
			settings: {
				foreground: c.gruvdfg4
			}
		},
		{
			scope: 'punctuation.definition.character-class.regexp',
			settings: {
				foreground: c.gruvdemphpurple
			}
		},
		{
			scope: 'string.quoted.double.json',
			settings: {
				foreground: c.gruvdemphgreen
			}
		},
		{
			name: 'JSON Level 0',
			scope: [
				'source.json meta.structure.dictionary.json support.type.property-name.json'
			],
			settings: {
				foreground: c.gruvyellow
			}
		},
		{
			name: 'JSON Level 1',
			scope: [
				'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
			],
			settings: {
				foreground: c.gruvdemphyellow
			}
		},
		{
			name: 'JSON Level 2',
			scope: [
				'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
			],
			settings: {
				foreground: c.gruvdfg
			}
		},
		{
			name: 'JSON Level 3',
			scope: [
				'source.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json meta.structure.dictionary.value.json meta.structure.dictionary.json support.type.property-name.json'
			],
			settings: {
				foreground: c.gruvdemphblue
			}
		},
		{
			scope: [
				'source.css support.constant',
				'source.css keyword.other.unit',
				'source.css constant',
				'constant.numeric.css',
				'source.sass keyword.control.unit',
				'support.constant.property-value.css.sass'
			],
			settings: {
				foreground: c.gruvlemphyellow
			}
		},
		{
			scope: 'variable.parameter.url.css',
			settings: {
				foreground: c.gruvdemphpurple,
				fontStyle: 'underline'
			}
		},
		{
			scope: 'punctuation.definition.entity.css',
			settings: {
				foreground: c.gruvyellow
			}
		},
		{
			scope: [
				'punctuation.definition.keyword.css',
				'meta.at-rule.import.scss punctuation.definition.keyword.scss',
				'meta.at-rule.include.scss punctuation.definition.keyword.scss',
				'meta.at-rule.mixin.scss punctuation.definition.keyword.scss',
				'meta.at-rule.function.scss punctuation.definition.keyword.scss',
				'meta.at-rule.use.scss punctuation.definition.keyword.scss',
				'meta.at-rule.forward.scss punctuation.definition.keyword.scss',
				'meta.at-rule.extend.scss punctuation.definition.keyword.scss',
				'meta.at-rule.use.scss punctuation.definition.keyword.scss',
				'meta.at-rule.at-root.scss punctuation.definition.keyword.scss',
				'source.css keyword.control.at-rule',
				'source.scss keyword.control.at-rule'
			],
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: [
				'punctuation.definition.interpolation.begin.bracket.curly.scss',
				'punctuation.definition.interpolation.end.bracket.curly.scss'
			],
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: [
				'meta.at-rule.media.header.css keyword.control.at-rule.media.css',
				'meta.at-rule.media.header.css punctuation.definition.keyword.css',
				'meta.at-rule.supports.header.css keyword.control.at-rule.supports.css',
				'meta.at-rule.supports.header.css punctuation.definition.keyword.css',
				'meta.at-rule.document.header.css keyword.control.at-rule.document.css',
				'meta.at-rule.document.header.css punctuation.definition.keyword.css',
				'meta.at-rule.each.scss punctuation.definition.keyword.scss',
				'meta.at-rule.if.scss punctuation.definition.keyword.scss',
				'meta.at-rule.else.scss punctuation.definition.keyword.scss',
				'punctuation.definition.keyword.scss',
				'keyword.control.at-rule.css.sass'
			],
			settings: {
				foreground: c.gruvdemphred
			}
		},
		{
			scope: [
				'variable.scss',
				'source.sass variable.other',
				'source.sass variable.other'
			],
			settings: {
				foreground: c.gruvdemphpurple
			}
		},
		{
			scope: ['support.type.property-name.css'],
			settings: {
				foreground: c.gruvdemphblue
			}
		},
		{
			scope: [
				'entity.other.attribute-name.pseudo-element.css',
				'entity.other.attribute-name.pseudo-class.css'
			],
			settings: {
				foreground: c.gruvorange
			}
		},
		{
			scope: 'source.css meta.selector',
			settings: {
				foreground: c.gruvdemphyellow
			}
		},
		{
			scope: [
				'entity.other.attribute-name.class',
				'entity.other.attribute-selector.sass'
			],
			settings: {
				foreground: c.gruvyellow
			}
		},
		{
			scope: [
				'source.css string',
				'source.css punctuation.definition.string',
				'meta.attribute-selector.scss'
			],
			settings: {
				foreground: c.gruvdemphgreen
			}
		},
		{
			scope: ['punctuation.definition.tag'],
			settings: {
				foreground: c.gruvgray
			}
		},
		{
			scope: [
				'punctuation.definition.template-expression.begin',
				'punctuation.definition.template-expression.end',
				'support.function.interpolation.sass'
			],
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: [
				'keyword.control.import.js',
				'keyword.control.from.js',
				'keyword.control.import.ts',
				'keyword.control.from.ts',
				'keyword.control.as.js',
				'keyword.control.as.ts',
				'keyword.control.export.js',
				'keyword.control.default.js',
				'keyword.control.default.ts',
				'keyword.control.export.ts',
				'storage.modifier.ts',
				'storage.modifier.js'
			],
			settings: {
				foreground: c.gruvdemphaqua
			}
		},
		{
			scope: [
				'entity.other.inherited-class.js',
				'entity.other.inherited-class.ts'
			],
			settings: {
				foreground: c.gruvdemphyellow
			}
		},
		{
			scope: ['source.js storage.type', 'source.ts storage.type'],
			settings: {
				foreground: c.gruvdemphorange
			}
		},
		{
			scope: ['variable.other.constant'],
			settings: {
				foreground: c.gruvdfg
			}
		}
	]
};
