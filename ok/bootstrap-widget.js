define(['OK/pts!video.vchat'], (function (pts) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var pts__default = /*#__PURE__*/_interopDefaultLegacy(pts);

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    /**
     * Shorthand for `elem.appendChild()` for better minification
     */
    function appendChild(element, node) {
        return element.appendChild(node);
    }
    /**
     * Creates element with given tag name
     * @param cssScope Scope for CSS isolation
     */
    function elem(tagName, cssScope) {
        const el = document.createElement(tagName);
        return cssScope ? isolateElement(el, cssScope) : el;
    }
    /**
     * Creates text node with given value
     */
    function text(value) {
        const node = textNode(value);
        node.$value = value;
        return node;
    }
    /**
     * Creates text node with given value
     */
    function textNode(value) {
        return document.createTextNode(value != null ? value : '');
    }
    /**
     * Updates given text node value, if required
     * @returns Returns `1` if text was updated, `0` otherwise
     */
    function updateText(node, value) {
        if (value !== node.$value) {
            // node.nodeValue = textValue(value);
            node.nodeValue = value != null ? value : '';
            node.$value = value;
            return 1;
        }
        return 0;
    }
    /**
     * Isolates given element with CSS scope
     */
    function isolateElement(el, cssScope) {
        el.setAttribute(cssScope, '');
        return el;
    }
    /**
     * @returns Inserted item
     */
    function domInsert(node, parent, anchor) {
        return anchor
            ? parent.insertBefore(node, anchor)
            : parent.appendChild(node);
    }
    /**
     * Removes given DOM node from its tree
     */
    function domRemove(node) {
        const { parentNode } = node;
        parentNode && parentNode.removeChild(node);
    }
    /**
     * Returns textual representation of given `value` object
     */
    // function textValue(value: any): string {
    // 	return value != null ? value : '';
    // }

    const animatingKey = '$$animating';
    /**
     * Creates fast object
     */
    function obj(proto = null) {
        return Object.create(proto);
    }
    /**
     * Check if given value id defined, e.g. not `null`, `undefined` or `NaN`
     */
    function isDefined(value) {
        return value != null && value === value;
    }
    /**
     * Returns properties from `next` which were changed since `prev` state.
     * Returns `null` if there are no changes
     */
    function changed(next, prev, prefix = '') {
        const result = obj();
        let dirty = false;
        // Check if data was actually changed
        for (const p in next) {
            if (prev[p] !== next[p]) {
                dirty = true;
                result[prefix ? prefix + p : p] = {
                    prev: prev[p],
                    current: next[p]
                };
            }
        }
        return dirty ? result : null;
    }
    // tslint:disable-next-line:only-arrow-functions
    const assign = Object.assign || function (target) {
        for (let i = 1, source; i < arguments.length; i++) {
            // eslint-disable-next-line prefer-rest-params
            source = arguments[i];
            for (const p in source) {
                // eslint-disable-next-line no-prototype-builtins
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }
        }
        return target;
    };
    /**
     * Returns property descriptors from given object
     */
    // tslint:disable-next-line:only-arrow-functions
    const getObjectDescriptors = Object['getOwnPropertyDescriptors'] || function (source) {
        const descriptors = obj();
        const props = Object.getOwnPropertyNames(source);
        for (let i = 0, prop, descriptor; i < props.length; i++) {
            prop = props[i];
            descriptor = Object.getOwnPropertyDescriptor(source, prop);
            if (descriptor != null) {
                descriptors[prop] = descriptor;
            }
        }
        return descriptors;
    };
    function captureError(host, fn, arg1, arg2) {
        try {
            return fn && fn(arg1, arg2);
        }
        catch (error) {
            runtimeError(host, error);
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    }
    function runtimeError(host, error) {
        if (typeof CustomEvent !== 'undefined') {
            host.dispatchEvent(new CustomEvent('runtime-error', {
                bubbles: true,
                cancelable: true,
                detail: { error, host }
            }));
        }
        else {
            throw error;
        }
    }
    /**
     * Schedule a microtask
     */
    const nextTick = (() => {
        if (typeof queueMicrotask !== 'undefined') {
            return queueMicrotask;
        }
        if (typeof Promise !== 'undefined') {
            const promise = Promise.resolve();
            return (fn) => {
                return promise.then(fn);
            };
        }
        return requestAnimationFrame;
    })();

    /**
     * Registers given event listener on `target` element and returns event binding
     * object to unregister event
     */
    function addEvent(target, type, listener, host, scope) {
        return registerBinding(type, { host, scope, target, listener, handleEvent });
    }
    /**
     * Unregister given event binding
     */
    function removeEvent(type, binding) {
        binding.target.removeEventListener(type, binding);
    }
    function handleEvent(event) {
        try {
            this.listener && this.listener(this.host, event, this.target, this.scope);
        }
        catch (error) {
            runtimeError(this.host, error);
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    }
    function safeEventListener(host, handler) {
        // tslint:disable-next-line:only-arrow-functions
        return function (event) {
            try {
                handler.call(this, event);
            }
            catch (error) {
                runtimeError(host, error);
                // tslint:disable-next-line:no-console
                console.error(error);
            }
        };
    }
    function registerBinding(type, binding) {
        binding.target.addEventListener(type, binding);
        return binding;
    }
    /**
     * Create pending props change set
     */
    function propsSet(elem, initial) {
        const base = obj(elem.componentModel.defaultProps);
        return initial ? assign(base, initial) : base;
    }
    /**
     * Alias for `elem.setAttribute`
     */
    function setAttribute(elem, name, value) {
        elem.setAttribute(name, value);
        return value;
    }
    /**
     * Updates element’s `name` attribute value only if it differs from previous value,
     * defined in `prev`
     */
    function updateAttribute(elem, prev, name, value) {
        if (value !== prev[name]) {
            const primitive = representedValue(value);
            if (primitive === null) {
                elem.removeAttribute(name);
            }
            else {
                setAttribute(elem, name, primitive);
            }
            prev[name] = value;
            return 1;
        }
        return 0;
    }
    /**
     * Alias for `elem.className`
     */
    function setClass(elem, value) {
        elem.className = value;
        return value;
    }
    /**
     * Shorthand to update class name, specific to Endorphin compiled code
     */
    function updateClass(elem, prev, value) {
        return updateAttribute(elem, prev, 'class', value === '' ? undefined : value);
    }
    /**
     * Sets attribute value as expression. Unlike regular primitive attributes,
     * expression values must be represented, e.g. non-primitive values must be
     * converted to string representations. Also, expression resolved to `false`,
     * `null` or `undefined` will remove attribute from element
     */
    function setAttributeExpression(elem, name, value) {
        const primitive = representedValue(value);
        primitive === null
            ? elem.removeAttribute(name)
            : setAttribute(elem, name, primitive);
        return value;
    }
    /**
     * Returns normalized list of class names from given string
     */
    function classNames(str) {
        if (isDefined(str)) {
            return String(str).split(/\s+/).filter(uniqueClassFilter).join(' ');
        }
        return '';
    }
    /**
     * Returns represented attribute value for given data
     */
    function representedValue(value) {
        if (value === false || !isDefined(value)) {
            return null;
        }
        if (value === true) {
            return '';
        }
        if (Array.isArray(value)) {
            return '[]';
        }
        if (typeof value === 'function') {
            return '𝑓';
        }
        if (typeof value === 'object') {
            return '{}';
        }
        return value;
    }
    function uniqueClassFilter(cl, index, arr) {
        return cl ? arr.indexOf(cl) === index : false;
    }

    /**
     * Creates linted list
     */
    /**
     * Creates linked list item
     */
    function createListItem(value) {
        return { value, next: null, prev: null };
    }
    /**
     * Prepends given value to linked list
     */
    function listPrependValue(list, value) {
        const item = createListItem(value);
        if (item.next = list.head) {
            item.next.prev = item;
        }
        return list.head = item;
    }
    /**
     * Inserts given value after given `ref` item
     */
    function listInsertValueAfter(value, ref) {
        const item = createListItem(value);
        const { next } = ref;
        ref.next = item;
        item.prev = ref;
        if (item.next = next) {
            next.prev = item;
        }
        return item;
    }
    /**
     * Detaches list fragment with `start` and `end` from list
     */
    function listDetachFragment(list, start, end) {
        const { prev } = start;
        const { next } = end;
        if (prev) {
            prev.next = next;
        }
        else {
            list.head = next;
        }
        if (next) {
            next.prev = prev;
        }
        start.prev = end.next = null;
    }

    /**
     * Creates injector instance for given target, if required
     */
    function createInjector(target) {
        return {
            parentNode: target,
            head: null,
            ptr: null,
            // NB create `slots` placeholder to promote object to hidden class.
            // Do not use any additional function argument for adding value to `slots`
            // to reduce runtime checks and keep functions in monomorphic state
            slots: null
        };
    }
    /**
     * Inserts given node into current context
     */
    function insert(injector, node, slotName = '') {
        const { slots, ptr } = injector;
        const target = slots
            ? getSlotContext(injector, slotName).element
            : injector.parentNode;
        domInsert(node, target, ptr ? getAnchorNode(ptr.next, target) : void 0);
        injector.ptr = ptr ? listInsertValueAfter(node, ptr) : listPrependValue(injector, node);
        return node;
    }
    /**
     * Injects given block
     */
    function injectBlock(injector, block) {
        const { ptr } = injector;
        if (ptr) {
            block.end = listInsertValueAfter(block, ptr);
            block.start = listInsertValueAfter(block, ptr);
        }
        else {
            block.end = listPrependValue(injector, block);
            block.start = listPrependValue(injector, block);
        }
        injector.ptr = block.end;
        return block;
    }
    /**
     * Returns named slot context from given component input’s injector. If slot context
     * doesn’t exists, it will be created
     */
    function getSlotContext(injector, name) {
        const slots = injector.slots;
        return slots[name] || (slots[name] = createSlotContext(name));
    }
    /**
     * Empties content of given block
     * @param detached Empty block in detached state. Detached state means one of the
     * parent DOM element will be removed from document so there’s no need to detach
     * inner DOM elements
     */
    function emptyBlockContent(block, detached) {
        const unmount = block.mount && block.mount.dispose;
        if (unmount) {
            unmount(block.scope, block.host);
        }
        let item = block.start.next;
        while (item && item !== block.end) {
            // tslint:disable-next-line:prefer-const
            let { next } = item;
            const { value, prev } = item;
            if (!isElement(value)) {
                next = value.end.next;
                disposeBlock(value);
            }
            else if (!detached && !value[animatingKey]) {
                domRemove(value);
            }
            // NB: Block always contains `.next` and `.prev` items which are block
            // bounds so we can safely skip null check here
            prev.next = next;
            next.prev = prev;
            item = next;
        }
    }
    /**
     * Disposes given block
     */
    function disposeBlock(block, detached) {
        emptyBlockContent(block, detached);
        listDetachFragment(block.injector, block.start, block.end);
        // @ts-ignore: Nulling disposed object
        block.start = block.end = block.scope = null;
    }
    function isElement(obj) {
        return 'nodeType' in obj;
    }
    /**
     * Get DOM node nearest to given position of items list
     */
    function getAnchorNode(item, parent) {
        while (item) {
            if (item.value.parentNode === parent) {
                return item.value;
            }
            item = item.next;
        }
    }
    /**
     * Creates context for given slot
     */
    function createSlotContext(name) {
        const element = document.createElement('slot');
        name && element.setAttribute('name', name);
        return {
            name,
            element,
            isDefault: false,
            defaultContent: null
        };
    }

    /**
     * Invokes `name` hook for given component definition
     */
    function runHook(component, name, arg1, arg2) {
        const { plugins, hooks } = component.componentModel;
        const callbacks = hooks[name];
        for (let i = plugins.length - 1, result, hook; i >= 0; i--) {
            hook = plugins[i][name];
            if (typeof hook === 'function') {
                try {
                    result = hook(component, arg1, arg2);
                    if (typeof result === 'function' && callbacks !== undefined) {
                        callbacks.push(result);
                    }
                }
                catch (error) {
                    runtimeError(component, error);
                    // tslint:disable-next-line:no-console
                    console.error(error);
                }
            }
        }
    }
    /**
     * Returns current variable scope
     */
    function getScope(elem) {
        return elem.componentModel.vars;
    }

    /**
     * Creates slot element
     */
    function createSlot(host, name, cssScope) {
        const el = getSlotContext(host.componentModel.input, name).element;
        return cssScope ? isolateElement(el, cssScope) : el;
    }
    /**
     * Mounts slot context
     */
    function mountSlot(host, name, defaultContent) {
        const { input } = host.componentModel;
        const ctx = getSlotContext(input, name);
        const injector = createInjector(ctx.element);
        if (defaultContent) {
            // Add block with default slot content
            ctx.defaultContent = injectBlock(injector, {
                host,
                injector,
                scope: getScope(host),
                content: defaultContent,
                mount: void 0,
                update: void 0
            });
        }
        if (isEmpty(ctx)) {
            // No incoming content, mount default content
            renderDefaultContent(ctx);
        }
        else {
            setSlotted(ctx, true);
        }
        return ctx;
    }
    /**
     * Unmounts default content of given slot context
     */
    function unmountSlot(ctx) {
        const block = ctx.defaultContent;
        if (block) {
            disposeBlock(block);
            setSlotted(ctx, false);
            ctx.isDefault = false;
            ctx.defaultContent = null;
        }
    }
    function notifySlotUpdate(host, ctx) {
        runHook(host, 'didSlotUpdate', ctx.name, ctx.element);
    }
    /**
     * Renders default slot content
     */
    function renderDefaultContent(ctx) {
        if (ctx.defaultContent) {
            const block = ctx.defaultContent;
            const { injector } = block;
            injector.ptr = block.start;
            block.mount = block.content;
            block.update = block.mount(block.host, injector, block.scope);
            injector.ptr = block.end;
        }
        setSlotted(ctx, false);
    }
    /**
     * Check if given slot is empty
     */
    function isEmpty(ctx) {
        // TODO better check for input content?
        return !ctx.element.childNodes.length;
    }
    /**
     * Toggles slotted state in slot container
     */
    function setSlotted(ctx, slotted) {
        ctx.isDefault = !slotted;
        slotted ? ctx.element.setAttribute('slotted', '') : ctx.element.removeAttribute('slotted');
    }

    let renderQueue = null;
    let nextTaskScheduled = null;
    /** A lookup of normalized attributes */
    const attributeLookup = {};
    /**
     * Creates Endorphin DOM component with given definition
     */
    function createComponent(name, definition, host) {
        let cssScope;
        let root;
        if (host && 'componentModel' in host) {
            cssScope = host.componentModel.definition.cssScope;
            root = host.root || host;
        }
        const element = elem(name, cssScope);
        return createComponentFromElement(element, definition, root);
    }
    /**
     * Convert HTMLElement into Endorphin DOM component with given definition
     */
    function createComponentFromElement(el, definition, root) {
        const element = el;
        // Add host scope marker: we can’t rely on tag name since component
        // definition is bound to element in runtime, not compile time
        if (definition.cssScope) {
            element.setAttribute(definition.cssScope + '-host', '');
        }
        const { props, state, extend, events, plugins } = prepare(element, definition);
        element.refs = obj();
        element.props = obj();
        element.state = state;
        element.componentView = element; // XXX Should point to Shadow Root in Web Components
        root && (element.root = root);
        addPropsState(element);
        if (extend) {
            Object.defineProperties(element, extend);
        }
        if (definition.store) {
            element.store = definition.store(root);
        }
        else if (root && root.store) {
            element.store = root.store;
        }
        // Create slotted input
        const input = createInjector(element.componentView);
        input.slots = obj();
        element.componentModel = {
            definition,
            input,
            vars: obj(),
            mounted: false,
            preparing: false,
            update: void 0,
            queued: false,
            events,
            plugins,
            partialDeps: null,
            defaultProps: props,
            hooks: {
                init: [],
                didChange: [],
                willMount: [],
                didMount: [],
                willRender: [],
                willUpdate: []
            }
        };
        runHook(element, 'init');
        return element;
    }
    /**
     * Mounts given component
     */
    function mountComponent(component, props) {
        const { componentModel } = component;
        const { input, definition } = componentModel;
        const changes = setPropsInternal(component, props || componentModel.defaultProps);
        const arg = changes || {};
        componentModel.preparing = true;
        // Notify slot status
        for (const p in input.slots) {
            notifySlotUpdate(component, input.slots[p]);
        }
        if (changes) {
            runHook(component, 'didChange', arg);
        }
        runHook(component, 'willMount', arg);
        runHook(component, 'willRender', arg);
        componentModel.preparing = false;
        componentModel.update = captureError(component, definition.default, component, getScope(component));
        componentModel.mounted = true;
        runCallbacks(component, 'willRender');
        runHook(component, 'didRender', arg);
        runCallbacks(component, 'willMount');
        runHook(component, 'didMount', arg);
        runCallbacks(component, 'didChange');
    }
    /**
     * Updates given mounted component
     */
    function updateComponent(component, props, partialDeps) {
        const { componentModel } = component;
        let changes = props && setPropsInternal(component, props);
        if (partialDeps) {
            if (!changes && partialDepsUpdated(componentModel.partialDeps, partialDeps)) {
                changes = obj();
            }
            componentModel.partialDeps = partialDeps;
        }
        if (changes || componentModel.queued) {
            renderNext(component, changes);
        }
        return changes ? 1 : 0;
    }
    /**
     * Destroys given component: removes static event listeners and cleans things up
     * @returns Should return nothing since function result will be used
     * as shorthand to reset cached value
     */
    function unmountComponent(component) {
        const { componentModel } = component;
        const { definition, events } = componentModel;
        runHook(component, 'willUnmount');
        componentModel.mounted = false;
        if (events) {
            detachStaticEvents(component, events);
        }
        if (component.store) {
            component.store.unwatch(component);
        }
        const dispose = definition.default && definition.default.dispose;
        captureError(component, dispose, getScope(component));
        runHook(component, 'didUnmount');
        runCallbacks(component, 'didMount');
        runCallbacks(component, 'init');
        // @ts-ignore: Nulling disposed object
        component.componentModel = null;
    }
    /**
     * Subscribes to store updates of given component
     */
    function subscribeStore(component, keys) {
        if (!component.store) {
            throw new Error(`Store is not defined for ${component.nodeName} component`);
        }
        component.store.watch(component, keys);
    }
    /**
     * Queues next component render
     */
    function renderNext(component, changes) {
        if (!component.componentModel.preparing) {
            renderComponent(component, changes);
        }
        else {
            scheduleRender(component, changes);
        }
    }
    /**
     * Schedules render of given component on next tick
     */
    function scheduleRender(component, changes) {
        if (!component.componentModel.queued) {
            component.componentModel.queued = true;
            if (renderQueue) {
                renderQueue.push(component, changes);
            }
            else {
                renderQueue = [component, changes];
            }
            if (!nextTaskScheduled) {
                nextTaskScheduled = window.setTimeout(() => {
                    window.clearTimeout(nextTaskScheduled);
                    nextTaskScheduled = null;
                    drainQueue();
                }, 1); // Different browsers behaviour, 1 is a best way to force planing callback to the next task
                return nextTick(drainQueue);
            }
        }
    }
    /**
     * Renders given component
     */
    function renderComponent(component, changes) {
        const { componentModel } = component;
        const arg = changes || {};
        componentModel.queued = false;
        componentModel.preparing = true;
        if (changes) {
            runHook(component, 'didChange', arg);
        }
        runHook(component, 'willUpdate', arg);
        runHook(component, 'willRender', arg);
        componentModel.preparing = false;
        captureError(component, componentModel.update, component, getScope(component));
        runCallbacks(component, 'willRender');
        runHook(component, 'didRender', arg);
        runCallbacks(component, 'willUpdate');
        runHook(component, 'didUpdate', arg);
        runCallbacks(component, 'didChange');
    }
    /**
     * Removes attached events from given map
     */
    function detachStaticEvents(component, eventMap) {
        const { listeners, handler } = eventMap;
        for (const p in listeners) {
            component.removeEventListener(p, handler);
        }
    }
    function kebabCase(ch) {
        return '-' + ch.toLowerCase();
    }
    function setPropsInternal(component, nextProps) {
        let changes;
        const { props } = component;
        const { defaultProps } = component.componentModel;
        let prev;
        let current;
        for (const p in nextProps) {
            prev = props[p];
            current = nextProps[p];
            if (current == null && p in defaultProps) {
                current = defaultProps[p];
            }
            if (p === 'class' && current != null) {
                current = classNames(current);
            }
            if (current !== prev) {
                if (!changes) {
                    changes = obj();
                }
                props[p] = current;
                changes[p] = { current, prev };
                if (!/^partial:/.test(p)) {
                    setAttributeExpression(component, normalizeAttribute(p), current);
                }
            }
        }
        return changes;
    }
    /**
     * Check if `next` contains value that differs from one in `prev`
     */
    function hasChanges(prev, next) {
        for (const p in next) {
            if (next[p] !== prev[p]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Prepares internal data for given component
     */
    function prepare(component, definition) {
        const props = obj();
        const state = obj();
        const plugins = collectPlugins(component, definition, [definition]);
        let events;
        let extend;
        for (let i = plugins.length - 1; i >= 0; i--) {
            const dfn = plugins[i];
            dfn.props && assign(props, dfn.props(component));
            dfn.state && assign(state, dfn.state(component));
            // NB: backward compatibility with previous implementation
            if (dfn.methods) {
                extend = getDescriptors(dfn.methods, extend);
            }
            if (dfn.extend) {
                extend = getDescriptors(dfn.extend, extend);
            }
            if (dfn.events) {
                if (!events) {
                    events = createEventsMap(component);
                }
                attachEventHandlers(component, dfn.events, events);
            }
        }
        return { props, state, extend, events, plugins };
    }
    /**
     * Collects all plugins (including nested) into a flat list
     */
    function collectPlugins(component, definition, dest = []) {
        let { plugins } = definition;
        if (typeof plugins === 'function') {
            plugins = plugins(component);
        }
        if (Array.isArray(plugins)) {
            for (let i = 0; i < plugins.length; i++) {
                dest.push(plugins[i]);
                collectPlugins(component, plugins[i], dest);
            }
        }
        return dest;
    }
    /**
     * Extracts property descriptors from given source object and merges it with `prev`
     * descriptor map, if given
     */
    function getDescriptors(source, prev) {
        const descriptors = getObjectDescriptors(source);
        return prev ? assign(prev, descriptors) : descriptors;
    }
    function createEventsMap(component) {
        const listeners = obj();
        const handler = function (evt) {
            if (component.componentModel) {
                const handlers = listeners[evt.type];
                for (let i = 0; i < handlers.length; i++) {
                    handlers[i](component, evt, this);
                }
            }
        };
        return { handler: safeEventListener(component, handler), listeners };
    }
    function attachEventHandlers(component, events, eventMap) {
        const names = Object.keys(events);
        const { listeners } = eventMap;
        for (let i = 0, name; i < names.length; i++) {
            name = names[i];
            if (name in listeners) {
                listeners[name].push(events[name]);
            }
            else {
                component.addEventListener(name, eventMap.handler);
                listeners[name] = [events[name]];
            }
        }
    }
    function addPropsState(element) {
        element.setProps = function setProps(value) {
            const { componentModel } = element;
            // In case of calling `setProps` after component was unmounted,
            // check if `componentModel` is available
            if (value != null && componentModel && componentModel.mounted) {
                const changes = setPropsInternal(element, assign(obj(), value));
                changes && renderNext(element, changes);
                return changes;
            }
        };
        element.setState = function setState(value) {
            const { componentModel } = element;
            // In case of calling `setState` after component was unmounted,
            // check if `componentModel` is available
            if (value != null && componentModel && hasChanges(element.state, value)) {
                assign(element.state, value);
                // If we’re in rendering state than current `setState()` is caused by
                // one of the `will*` hooks, which means applied changes will be automatically
                // applied during rendering stage.
                // If called outside of rendering state we should schedule render
                // on next tick
                if (componentModel.mounted && !componentModel.preparing) {
                    scheduleRender(element);
                }
            }
        };
    }
    function drainQueue() {
        const pending = renderQueue;
        // If queue is empty nothing to do
        if (!pending) {
            return;
        }
        renderQueue = null;
        for (let i = 0, component; i < pending.length; i += 2) {
            component = pending[i];
            // It’s possible that a component can be rendered before next tick
            // (for example, if parent node updated component props).
            // Check if it’s still queued then render.
            // Also, component can be unmounted after it’s rendering was scheduled
            if (component.componentModel && component.componentModel.queued) {
                renderComponent(component, pending[i + 1]);
            }
        }
    }
    /**
     * Normalizes given attribute name: converts `camelCase` to `kebab-case`
     */
    function normalizeAttribute(attr) {
        if (!(attr in attributeLookup)) {
            attributeLookup[attr] = attr.replace(/[A-Z]/g, kebabCase);
        }
        return attributeLookup[attr];
    }
    /**
     * Check if partial dependencies of component were updated
     */
    function partialDepsUpdated(prev, next) {
        if (!prev) {
            return true;
        }
        // In compiler, deps will always have the same length
        for (let i = 0; i < prev.length; i++) {
            if (prev[i] !== next[i]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Runs hook callbacks
     */
    function runCallbacks(component, name) {
        const callbacks = component.componentModel.hooks[name];
        if (callbacks !== undefined) {
            for (let i = 0; i < callbacks.length; i++) {
                try {
                    callbacks[i]();
                }
                catch (error) {
                    runtimeError(component, error);
                    // tslint:disable-next-line:no-console
                    console.error(error);
                }
            }
            callbacks.length = 0;
        }
    }

    function mountBlock(host, injector, get) {
        const block = injectBlock(injector, {
            host,
            injector,
            scope: getScope(host),
            get,
            mount: undefined,
            update: undefined
        });
        updateBlock(block);
        return block;
    }
    /**
     * Updated block, described in `ctx` object
     * @returns Returns `1` if block was updated, `0` otherwise
     */
    function updateBlock(block) {
        let updated = 0;
        const { host, injector, scope } = block;
        const mount = block.get(host, scope);
        if (block.mount !== mount) {
            updated = 1;
            // Unmount previously rendered content
            block.mount && emptyBlockContent(block);
            // Mount new block content
            injector.ptr = block.start;
            block.mount = mount;
            block.update = mount && mount(block.host, injector, scope);
        }
        else if (block.update) {
            // Update rendered result
            updated = block.update(host, scope) ? 1 : 0;
        }
        block.injector.ptr = block.end;
        return updated;
    }
    function unmountBlock(block) {
        disposeBlock(block);
    }
    function clearBlock(block) {
        disposeBlock(block, true);
    }

    /**
     * Renders code, returned from `get` function, as HTML
     */
    function mountInnerHTML(host, injector, get, slotName) {
        const block = injectBlock(injector, {
            host,
            injector,
            scope: getScope(host),
            get,
            code: null,
            slotName
        });
        updateInnerHTML(block);
        return block;
    }
    /**
     * Updates inner HTML of block, defined in `ctx`
     * @returns Returns `1` if inner HTML was updated, `0` otherwise
     */
    function updateInnerHTML(block) {
        const { host, injector, scope } = block;
        const code = block.get(host, scope);
        if (code !== block.code) {
            emptyBlockContent(block);
            if (isDefined(block.code = code)) {
                injector.ptr = block.start;
                renderHTML(host, injector, code, block.slotName);
            }
            injector.ptr = block.end;
            return 1;
        }
        return 0;
    }
    function clearInnerHTML(block) {
        disposeBlock(block, true);
    }
    function renderHTML(host, injector, code, slotName) {
        const { cssScope } = host.componentModel.definition;
        if (isNode(code)) {
            // Insert as DOM element
            cssScope && scopeDOM(code, cssScope);
            if (code.nodeType === code.DOCUMENT_FRAGMENT_NODE) {
                // Insert document fragment contents separately to properly maintain
                // list of inserted elements
                while (code.firstChild) {
                    insert(injector, code.firstChild, slotName);
                }
            }
            else {
                insert(injector, code, slotName);
            }
        }
        else {
            // Render as HTML
            const div = document.createElement('div');
            div.innerHTML = code;
            cssScope && scopeDOM(div, cssScope);
            while (div.firstChild) {
                insert(injector, div.firstChild, slotName);
            }
        }
    }
    /**
     * Scopes CSS of all elements in given node
     */
    function scopeDOM(node, cssScope) {
        node = node.firstChild;
        while (node) {
            if (node.nodeType === node.ELEMENT_NODE) {
                isolateElement(node, cssScope);
                scopeDOM(node, cssScope);
            }
            node = node.nextSibling;
        }
    }
    function isNode(obj) {
        return obj && obj.nodeType;
    }

    const prefix = '$';
    class Store {
        constructor(data) {
            this.sync = false;
            this.listeners = [];
            this.data = assign({}, data || {});
        }
        /**
         * Returns current store data
         */
        get() {
            return this.data;
        }
        /**
         * Updates data in store
         */
        set(data) {
            const updated = changed(data, this.data, prefix);
            const render = this.sync ? renderComponent : scheduleRender;
            if (updated) {
                const next = this.data = assign(this.data, data);
                // Notify listeners.
                // Run in reverse order for listener safety (in case if handler decides
                // to unsubscribe during notification)
                for (let i = this.listeners.length - 1, item; i >= 0; i--) {
                    item = this.listeners[i];
                    if (!item.keys || !item.keys.length || hasChange(item.keys, updated)) {
                        if ('component' in item) {
                            render(item.component, updated);
                        }
                        else if ('handler' in item) {
                            item.handler(next, updated);
                        }
                    }
                }
            }
        }
        /**
         * Subscribes to changes in given store
         * @param handler Function to invoke when store changes
         * @param keys Run handler only if given top-level keys are changed
         * @returns Object that should be used to unsubscribe from updates
         */
        subscribe(handler, keys) {
            const obj = {
                handler,
                keys: scopeKeys(keys, prefix)
            };
            this.listeners.push(obj);
            return obj;
        }
        /**
         * Unsubscribes from further updates
         */
        unsubscribe(obj) {
            const ix = this.listeners.indexOf(obj);
            if (ix !== -1) {
                this.listeners.splice(ix, 1);
            }
        }
        /**
         * Watches for updates of given `keys` in store and runs `component` render on change
         */
        watch(component, keys) {
            this.listeners.push({
                component,
                keys: scopeKeys(keys, prefix)
            });
        }
        /**
         * Stops watching for store updates for given component
         */
        unwatch(component) {
            for (let i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i].component === component) {
                    this.listeners.splice(i, 1);
                }
            }
        }
    }
    /**
     * Check if any of `keys` was changed in `next` object since `prev` state
     */
    function hasChange(keys, updated) {
        for (let i = 0; i < keys.length; i++) {
            if (keys[i] in updated) {
                return true;
            }
        }
        return false;
    }
    /**
     * Adds given prefix to keys
     */
    function scopeKeys(keys, pfx) {
        return keys && pfx ? keys.map(key => pfx + key) : keys;
    }

    const pool = [];
    if (typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', () => {
            if (pool.length && pageInvisible()) {
                resumeTweenLoop();
            }
        });
    }
    function tweenLoopIteration(now) {
        for (let i = pool.length - 1, anim; i >= 0; i--) {
            anim = pool[i];
            const { elem, options } = anim;
            if (now >= anim.start) {
                if (!anim.started) {
                    anim.started = true;
                    options.start && options.start(elem, options);
                }
                const finished = now >= anim.end;
                const pos = finished ? 1 : options.easing(now - anim.start, 0, 1, options.duration);
                options.step && options.step(elem, pos, options);
                if (finished) {
                    stopAnimation(elem);
                }
            }
        }
        resumeTweenLoop();
    }
    let rafId = 0;
    function resumeTweenLoop(isNextFrame) {
        cancelAnimationFrame(rafId);
        if (pool.length) {
            rafId = requestAnimationFrame(tweenLoopIteration);
        }
    }
    function stopAnimation(elem, cancel) {
        const state = elem && elem[animatingKey];
        if (state) {
            state.onComplete(cancel);
            elem[animatingKey] = undefined;
        }
    }
    function pageInvisible() {
        return document.visibilityState ? document.visibilityState !== 'hidden' : false;
    }

    function mountUse(host, elem, factory, param) {
        return {
            param,
            directive: factory.call(host, elem, param)
        };
    }
    function updateUse(data, param) {
        if (param !== data.param && data.directive && data.directive.update) {
            data.directive.update(data.param = param);
        }
    }
    function unmountUse(data) {
        if (data.directive && data.directive.destroy) {
            data.directive.destroy();
        }
    }

    /**
     * Creates Endorphin component and mounts it into given `options.target` container
     */
    function endorphin(name, definition, options = {}) {
        const component = createComponent(name, definition, options.target);
        if (options.store) {
            component.store = options.store;
        }
        if (options.target && !options.detached) {
            options.target.appendChild(component);
        }
        mountComponent(component, options.props);
        return component;
    }
    /**
     * Safe property getter
     */
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    function get(ctx) {
        const hasMap = typeof Map !== 'undefined';
        for (let i = 1, il = arguments.length, arg; ctx != null && i < il; i++) {
            // eslint-disable-next-line prefer-rest-params
            arg = arguments[i];
            if (hasMap && ctx instanceof Map) {
                ctx = ctx.get(arg);
            }
            else {
                ctx = ctx[arg];
            }
        }
        return ctx;
    }
    /**
     * Invokes `methodName` of `ctx` object with given args
     */
    function call(ctx, methodName, args) {
        const method = ctx != null && ctx[methodName];
        if (typeof method === 'function') {
            return args ? method.apply(ctx, args) : method.call(ctx);
        }
    }

    /*
     * Generates a RFC4122, version 4 ID uuid.
     * Example: "92329D39-6F5C-4520-ABFC-AAB64544E172"
     *
     * © Robert Kieffer, 2008
     * Dual licensed under the MIT and GPL licenses.
     * Latest version:   http://www.broofa.com/Tools/Math.uuid.js
     * Information:      http://www.broofa.com/blog/?p=151
     * Contact:          robert@broofa.com
     */
    function uuid() {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const result = new Array(36);
        let rnd = 0, r, i;
        for (i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                result[i] = '-';
            }
            else if (i === 14) {
                result[i] = '4';
            }
            else {
                if (rnd <= 0x02) {
                    rnd = (0x2000000 + Math.random() * 0x1000000) | 0;
                }
                r = rnd & 0xf;
                rnd = rnd >> 4;
                result[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
            }
        }
        return result.join('');
    }

    const DISPLAY_DURATION = 5000;
    /**
     * Service to display in-place notifications (toasts)
     */
    class ToastService {
        constructor(store) {
            this.store = store;
            this.timers = new Map();
            this.store = store;
            store.set({ toasts: [] });
        }
        add(toast) {
            var _a;
            if ('string' === typeof toast) {
                toast = {
                    text: toast,
                };
            }
            const toastWithId = Object.assign({ id: uuid() }, toast);
            this.store.set({ toasts: [toastWithId, ...this.store.get().toasts] });
            this.timers.set(toastWithId.id, window.setTimeout(() => this.dismiss(toastWithId.id), (_a = toastWithId.duration) !== null && _a !== void 0 ? _a : DISPLAY_DURATION));
            return toastWithId.id;
        }
        dismiss(toastId) {
            if (this.timers.has(toastId)) {
                clearTimeout(this.timers.get(toastId));
                this.timers.delete(toastId);
            }
            this.store.set({ toasts: this.store.get().toasts.filter((toast) => toast.id !== toastId) });
        }
        dismissAll() {
            this.timers.forEach((timer) => {
                clearTimeout(timer);
            });
            this.timers.clear();
            this.store.set({ toasts: [] });
        }
    }

    class Import$1 {
        static require(modulesPath) {
            return new Promise((resolve) => {
                window.require(modulesPath, (...modulesImpl) => resolve(modulesImpl));
            });
        }
        static module(name, cb) {
            if (this.defined(name)) {
                const module = window.require(name);
                if (cb) {
                    cb(module);
                }
                return module;
            }
        }
        static defined(name) {
            return window.require && window.require.defined(name);
        }
    }

    function getVanilla() {
        return Import$1.require(['OK/utils/vanilla']);
    }
    function getWebApi() {
        return Import$1.require(['OK/webapi']);
    }
    const webapiInvoke = (endpoint, parameters, options) => getWebApi().then(([webapi]) => webapi.invoke(endpoint, parameters, options));
    const vanillaAjax = (requestData) => getVanilla().then(([vanilla]) => vanilla.ajax(requestData));
    function requestUpdateBlockModel(url, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const [vanilla] = yield getVanilla();
            const response = yield vanilla.ajax({ url, data });
            return vanilla.updateBlockModelCallback(response);
        });
    }
    /**
     * Получение JSON обьекта из формата ок передачи данных в виде комментариев DOM
     */
    function getJSONFromComments(selector) {
        const el = document.querySelector(selector);
        try {
            return JSON.parse(el.childNodes[0].textContent || '');
        }
        catch (e) {
            return null;
        }
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    let logDisabled_ = true;
    let deprecationWarnings_ = true;

    /**
     * Extract browser version out of the provided user agent string.
     *
     * @param {!string} uastring userAgent string.
     * @param {!string} expr Regular expression used as match criteria.
     * @param {!number} pos position in the version string to be returned.
     * @return {!number} browser version.
     */
    function extractVersion(uastring, expr, pos) {
      const match = uastring.match(expr);
      return match && match.length >= pos && parseInt(match[pos], 10);
    }

    // Wraps the peerconnection event eventNameToWrap in a function
    // which returns the modified event object (or false to prevent
    // the event).
    function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
      if (!window.RTCPeerConnection) {
        return;
      }
      const proto = window.RTCPeerConnection.prototype;
      const nativeAddEventListener = proto.addEventListener;
      proto.addEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap) {
          return nativeAddEventListener.apply(this, arguments);
        }
        const wrappedCallback = (e) => {
          const modifiedEvent = wrapper(e);
          if (modifiedEvent) {
            if (cb.handleEvent) {
              cb.handleEvent(modifiedEvent);
            } else {
              cb(modifiedEvent);
            }
          }
        };
        this._eventMap = this._eventMap || {};
        if (!this._eventMap[eventNameToWrap]) {
          this._eventMap[eventNameToWrap] = new Map();
        }
        this._eventMap[eventNameToWrap].set(cb, wrappedCallback);
        return nativeAddEventListener.apply(this, [nativeEventName,
          wrappedCallback]);
      };

      const nativeRemoveEventListener = proto.removeEventListener;
      proto.removeEventListener = function(nativeEventName, cb) {
        if (nativeEventName !== eventNameToWrap || !this._eventMap
            || !this._eventMap[eventNameToWrap]) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        if (!this._eventMap[eventNameToWrap].has(cb)) {
          return nativeRemoveEventListener.apply(this, arguments);
        }
        const unwrappedCb = this._eventMap[eventNameToWrap].get(cb);
        this._eventMap[eventNameToWrap].delete(cb);
        if (this._eventMap[eventNameToWrap].size === 0) {
          delete this._eventMap[eventNameToWrap];
        }
        if (Object.keys(this._eventMap).length === 0) {
          delete this._eventMap;
        }
        return nativeRemoveEventListener.apply(this, [nativeEventName,
          unwrappedCb]);
      };

      Object.defineProperty(proto, 'on' + eventNameToWrap, {
        get() {
          return this['_on' + eventNameToWrap];
        },
        set(cb) {
          if (this['_on' + eventNameToWrap]) {
            this.removeEventListener(eventNameToWrap,
                this['_on' + eventNameToWrap]);
            delete this['_on' + eventNameToWrap];
          }
          if (cb) {
            this.addEventListener(eventNameToWrap,
                this['_on' + eventNameToWrap] = cb);
          }
        },
        enumerable: true,
        configurable: true
      });
    }

    function disableLog(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + typeof bool +
            '. Please use a boolean.');
      }
      logDisabled_ = bool;
      return (bool) ? 'adapter.js logging disabled' :
          'adapter.js logging enabled';
    }

    /**
     * Disable or enable deprecation warnings
     * @param {!boolean} bool set to true to disable warnings.
     */
    function disableWarnings(bool) {
      if (typeof bool !== 'boolean') {
        return new Error('Argument type: ' + typeof bool +
            '. Please use a boolean.');
      }
      deprecationWarnings_ = !bool;
      return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
    }

    function log() {
      if (typeof window === 'object') {
        if (logDisabled_) {
          return;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log.apply(console, arguments);
        }
      }
    }

    /**
     * Shows a deprecation warning suggesting the modern and spec-compatible API.
     */
    function deprecated(oldMethod, newMethod) {
      if (!deprecationWarnings_) {
        return;
      }
      console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
          ' instead.');
    }

    /**
     * Browser detector.
     *
     * @return {object} result containing browser and version
     *     properties.
     */
    function detectBrowser(window) {
      // Returned result object.
      const result = {browser: null, version: null};

      // Fail early if it's not a browser
      if (typeof window === 'undefined' || !window.navigator) {
        result.browser = 'Not a browser.';
        return result;
      }

      const {navigator} = window;

      if (navigator.mozGetUserMedia) { // Firefox.
        result.browser = 'firefox';
        result.version = extractVersion(navigator.userAgent,
            /Firefox\/(\d+)\./, 1);
      } else if (navigator.webkitGetUserMedia ||
          (window.isSecureContext === false && window.webkitRTCPeerConnection &&
           !window.RTCIceGatherer)) {
        // Chrome, Chromium, Webview, Opera.
        // Version matches Chrome/WebRTC version.
        // Chrome 74 removed webkitGetUserMedia on http as well so we need the
        // more complicated fallback to webkitRTCPeerConnection.
        result.browser = 'chrome';
        result.version = extractVersion(navigator.userAgent,
            /Chrom(e|ium)\/(\d+)\./, 2);
      } else if (navigator.mediaDevices &&
          navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
        result.browser = 'edge';
        result.version = extractVersion(navigator.userAgent,
            /Edge\/(\d+).(\d+)$/, 2);
      } else if (window.RTCPeerConnection &&
          navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
        result.browser = 'safari';
        result.version = extractVersion(navigator.userAgent,
            /AppleWebKit\/(\d+)\./, 1);
        result.supportsUnifiedPlan = window.RTCRtpTransceiver &&
            'currentDirection' in window.RTCRtpTransceiver.prototype;
      } else { // Default fallthrough: not supported.
        result.browser = 'Not a supported browser.';
        return result;
      }

      return result;
    }

    /**
     * Checks if something is an object.
     *
     * @param {*} val The something you want to check.
     * @return true if val is an object, false otherwise.
     */
    function isObject$1(val) {
      return Object.prototype.toString.call(val) === '[object Object]';
    }

    /**
     * Remove all empty objects and undefined values
     * from a nested object -- an enhanced and vanilla version
     * of Lodash's `compact`.
     */
    function compactObject(data) {
      if (!isObject$1(data)) {
        return data;
      }

      return Object.keys(data).reduce(function(accumulator, key) {
        const isObj = isObject$1(data[key]);
        const value = isObj ? compactObject(data[key]) : data[key];
        const isEmptyObject = isObj && !Object.keys(value).length;
        if (value === undefined || isEmptyObject) {
          return accumulator;
        }
        return Object.assign(accumulator, {[key]: value});
      }, {});
    }

    /* iterates the stats graph recursively. */
    function walkStats(stats, base, resultSet) {
      if (!base || resultSet.has(base.id)) {
        return;
      }
      resultSet.set(base.id, base);
      Object.keys(base).forEach(name => {
        if (name.endsWith('Id')) {
          walkStats(stats, stats.get(base[name]), resultSet);
        } else if (name.endsWith('Ids')) {
          base[name].forEach(id => {
            walkStats(stats, stats.get(id), resultSet);
          });
        }
      });
    }

    /* filter getStats for a sender/receiver track. */
    function filterStats(result, track, outbound) {
      const streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
      const filteredResult = new Map();
      if (track === null) {
        return filteredResult;
      }
      const trackStats = [];
      result.forEach(value => {
        if (value.type === 'track' &&
            value.trackIdentifier === track.id) {
          trackStats.push(value);
        }
      });
      trackStats.forEach(trackStat => {
        result.forEach(stats => {
          if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
            walkStats(result, stats, filteredResult);
          }
        });
      });
      return filteredResult;
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    const logging = log;

    function shimGetUserMedia$3(window) {
      const navigator = window && window.navigator;

      if (!navigator.mediaDevices) {
        return;
      }

      const browserDetails = detectBrowser(window);

      const constraintsToChrome_ = function(c) {
        if (typeof c !== 'object' || c.mandatory || c.optional) {
          return c;
        }
        const cc = {};
        Object.keys(c).forEach(key => {
          if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
            return;
          }
          const r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
          if (r.exact !== undefined && typeof r.exact === 'number') {
            r.min = r.max = r.exact;
          }
          const oldname_ = function(prefix, name) {
            if (prefix) {
              return prefix + name.charAt(0).toUpperCase() + name.slice(1);
            }
            return (name === 'deviceId') ? 'sourceId' : name;
          };
          if (r.ideal !== undefined) {
            cc.optional = cc.optional || [];
            let oc = {};
            if (typeof r.ideal === 'number') {
              oc[oldname_('min', key)] = r.ideal;
              cc.optional.push(oc);
              oc = {};
              oc[oldname_('max', key)] = r.ideal;
              cc.optional.push(oc);
            } else {
              oc[oldname_('', key)] = r.ideal;
              cc.optional.push(oc);
            }
          }
          if (r.exact !== undefined && typeof r.exact !== 'number') {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_('', key)] = r.exact;
          } else {
            ['min', 'max'].forEach(mix => {
              if (r[mix] !== undefined) {
                cc.mandatory = cc.mandatory || {};
                cc.mandatory[oldname_(mix, key)] = r[mix];
              }
            });
          }
        });
        if (c.advanced) {
          cc.optional = (cc.optional || []).concat(c.advanced);
        }
        return cc;
      };

      const shimConstraints_ = function(constraints, func) {
        if (browserDetails.version >= 61) {
          return func(constraints);
        }
        constraints = JSON.parse(JSON.stringify(constraints));
        if (constraints && typeof constraints.audio === 'object') {
          const remap = function(obj, a, b) {
            if (a in obj && !(b in obj)) {
              obj[b] = obj[a];
              delete obj[a];
            }
          };
          constraints = JSON.parse(JSON.stringify(constraints));
          remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
          remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
          constraints.audio = constraintsToChrome_(constraints.audio);
        }
        if (constraints && typeof constraints.video === 'object') {
          // Shim facingMode for mobile & surface pro.
          let face = constraints.video.facingMode;
          face = face && ((typeof face === 'object') ? face : {ideal: face});
          const getSupportedFacingModeLies = browserDetails.version < 66;

          if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                        face.ideal === 'user' || face.ideal === 'environment')) &&
              !(navigator.mediaDevices.getSupportedConstraints &&
                navigator.mediaDevices.getSupportedConstraints().facingMode &&
                !getSupportedFacingModeLies)) {
            delete constraints.video.facingMode;
            let matches;
            if (face.exact === 'environment' || face.ideal === 'environment') {
              matches = ['back', 'rear'];
            } else if (face.exact === 'user' || face.ideal === 'user') {
              matches = ['front'];
            }
            if (matches) {
              // Look for matches in label, or use last cam for back (typical).
              return navigator.mediaDevices.enumerateDevices()
              .then(devices => {
                devices = devices.filter(d => d.kind === 'videoinput');
                let dev = devices.find(d => matches.some(match =>
                  d.label.toLowerCase().includes(match)));
                if (!dev && devices.length && matches.includes('back')) {
                  dev = devices[devices.length - 1]; // more likely the back cam
                }
                if (dev) {
                  constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                            {ideal: dev.deviceId};
                }
                constraints.video = constraintsToChrome_(constraints.video);
                logging('chrome: ' + JSON.stringify(constraints));
                return func(constraints);
              });
            }
          }
          constraints.video = constraintsToChrome_(constraints.video);
        }
        logging('chrome: ' + JSON.stringify(constraints));
        return func(constraints);
      };

      const shimError_ = function(e) {
        if (browserDetails.version >= 64) {
          return e;
        }
        return {
          name: {
            PermissionDeniedError: 'NotAllowedError',
            PermissionDismissedError: 'NotAllowedError',
            InvalidStateError: 'NotAllowedError',
            DevicesNotFoundError: 'NotFoundError',
            ConstraintNotSatisfiedError: 'OverconstrainedError',
            TrackStartError: 'NotReadableError',
            MediaDeviceFailedDueToShutdown: 'NotAllowedError',
            MediaDeviceKillSwitchOn: 'NotAllowedError',
            TabCaptureError: 'AbortError',
            ScreenCaptureError: 'AbortError',
            DeviceCaptureError: 'AbortError'
          }[e.name] || e.name,
          message: e.message,
          constraint: e.constraint || e.constraintName,
          toString() {
            return this.name + (this.message && ': ') + this.message;
          }
        };
      };

      const getUserMedia_ = function(constraints, onSuccess, onError) {
        shimConstraints_(constraints, c => {
          navigator.webkitGetUserMedia(c, onSuccess, e => {
            if (onError) {
              onError(shimError_(e));
            }
          });
        });
      };
      navigator.getUserMedia = getUserMedia_.bind(navigator);

      // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
      // function which returns a Promise, it does not accept spec-style
      // constraints.
      if (navigator.mediaDevices.getUserMedia) {
        const origGetUserMedia = navigator.mediaDevices.getUserMedia.
            bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(cs) {
          return shimConstraints_(cs, c => origGetUserMedia(c).then(stream => {
            if (c.audio && !stream.getAudioTracks().length ||
                c.video && !stream.getVideoTracks().length) {
              stream.getTracks().forEach(track => {
                track.stop();
              });
              throw new DOMException('', 'NotFoundError');
            }
            return stream;
          }, e => Promise.reject(shimError_(e))));
        };
      }
    }

    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    function shimGetDisplayMedia$2(window, getSourceId) {
      if (window.navigator.mediaDevices &&
        'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!(window.navigator.mediaDevices)) {
        return;
      }
      // getSourceId is a function that returns a promise resolving with
      // the sourceId of the screen/window/tab to be shared.
      if (typeof getSourceId !== 'function') {
        console.error('shimGetDisplayMedia: getSourceId argument is not ' +
            'a function');
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia =
        function getDisplayMedia(constraints) {
          return getSourceId(constraints)
            .then(sourceId => {
              const widthSpecified = constraints.video && constraints.video.width;
              const heightSpecified = constraints.video &&
                constraints.video.height;
              const frameRateSpecified = constraints.video &&
                constraints.video.frameRate;
              constraints.video = {
                mandatory: {
                  chromeMediaSource: 'desktop',
                  chromeMediaSourceId: sourceId,
                  maxFrameRate: frameRateSpecified || 3
                }
              };
              if (widthSpecified) {
                constraints.video.mandatory.maxWidth = widthSpecified;
              }
              if (heightSpecified) {
                constraints.video.mandatory.maxHeight = heightSpecified;
              }
              return window.navigator.mediaDevices.getUserMedia(constraints);
            });
        };
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimMediaStream(window) {
      window.MediaStream = window.MediaStream || window.webkitMediaStream;
    }

    function shimOnTrack$1(window) {
      if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
          window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
          get() {
            return this._ontrack;
          },
          set(f) {
            if (this._ontrack) {
              this.removeEventListener('track', this._ontrack);
            }
            this.addEventListener('track', this._ontrack = f);
          },
          enumerable: true,
          configurable: true
        });
        const origSetRemoteDescription =
            window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription =
          function setRemoteDescription() {
            if (!this._ontrackpoly) {
              this._ontrackpoly = (e) => {
                // onaddstream does not fire when a track is added to an existing
                // stream. But stream.onaddtrack is implemented so we use that.
                e.stream.addEventListener('addtrack', te => {
                  let receiver;
                  if (window.RTCPeerConnection.prototype.getReceivers) {
                    receiver = this.getReceivers()
                      .find(r => r.track && r.track.id === te.track.id);
                  } else {
                    receiver = {track: te.track};
                  }

                  const event = new Event('track');
                  event.track = te.track;
                  event.receiver = receiver;
                  event.transceiver = {receiver};
                  event.streams = [e.stream];
                  this.dispatchEvent(event);
                });
                e.stream.getTracks().forEach(track => {
                  let receiver;
                  if (window.RTCPeerConnection.prototype.getReceivers) {
                    receiver = this.getReceivers()
                      .find(r => r.track && r.track.id === track.id);
                  } else {
                    receiver = {track};
                  }
                  const event = new Event('track');
                  event.track = track;
                  event.receiver = receiver;
                  event.transceiver = {receiver};
                  event.streams = [e.stream];
                  this.dispatchEvent(event);
                });
              };
              this.addEventListener('addstream', this._ontrackpoly);
            }
            return origSetRemoteDescription.apply(this, arguments);
          };
      } else {
        // even if RTCRtpTransceiver is in window, it is only used and
        // emitted in unified-plan. Unfortunately this means we need
        // to unconditionally wrap the event.
        wrapPeerConnectionEvent(window, 'track', e => {
          if (!e.transceiver) {
            Object.defineProperty(e, 'transceiver',
              {value: {receiver: e.receiver}});
          }
          return e;
        });
      }
    }

    function shimGetSendersWithDtmf(window) {
      // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
      if (typeof window === 'object' && window.RTCPeerConnection &&
          !('getSenders' in window.RTCPeerConnection.prototype) &&
          'createDTMFSender' in window.RTCPeerConnection.prototype) {
        const shimSenderWithDtmf = function(pc, track) {
          return {
            track,
            get dtmf() {
              if (this._dtmf === undefined) {
                if (track.kind === 'audio') {
                  this._dtmf = pc.createDTMFSender(track);
                } else {
                  this._dtmf = null;
                }
              }
              return this._dtmf;
            },
            _pc: pc
          };
        };

        // augment addTrack when getSenders is not available.
        if (!window.RTCPeerConnection.prototype.getSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            this._senders = this._senders || [];
            return this._senders.slice(); // return a copy of the internal state.
          };
          const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
          window.RTCPeerConnection.prototype.addTrack =
            function addTrack(track, stream) {
              let sender = origAddTrack.apply(this, arguments);
              if (!sender) {
                sender = shimSenderWithDtmf(this, track);
                this._senders.push(sender);
              }
              return sender;
            };

          const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
          window.RTCPeerConnection.prototype.removeTrack =
            function removeTrack(sender) {
              origRemoveTrack.apply(this, arguments);
              const idx = this._senders.indexOf(sender);
              if (idx !== -1) {
                this._senders.splice(idx, 1);
              }
            };
        }
        const origAddStream = window.RTCPeerConnection.prototype.addStream;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          this._senders = this._senders || [];
          origAddStream.apply(this, [stream]);
          stream.getTracks().forEach(track => {
            this._senders.push(shimSenderWithDtmf(this, track));
          });
        };

        const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
        window.RTCPeerConnection.prototype.removeStream =
          function removeStream(stream) {
            this._senders = this._senders || [];
            origRemoveStream.apply(this, [stream]);

            stream.getTracks().forEach(track => {
              const sender = this._senders.find(s => s.track === track);
              if (sender) { // remove sender
                this._senders.splice(this._senders.indexOf(sender), 1);
              }
            });
          };
      } else if (typeof window === 'object' && window.RTCPeerConnection &&
                 'getSenders' in window.RTCPeerConnection.prototype &&
                 'createDTMFSender' in window.RTCPeerConnection.prototype &&
                 window.RTCRtpSender &&
                 !('dtmf' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach(sender => sender._pc = this);
          return senders;
        };

        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = this._pc.createDTMFSender(this.track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
    }

    function shimGetStats(window) {
      if (!window.RTCPeerConnection) {
        return;
      }

      const origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;

        // If selector is a function then we are in the old style stats so just
        // pass back the original getStats format to avoid breaking old users.
        if (arguments.length > 0 && typeof selector === 'function') {
          return origGetStats.apply(this, arguments);
        }

        // When spec-style getStats is supported, return those when called with
        // either no arguments or the selector argument is null.
        if (origGetStats.length === 0 && (arguments.length === 0 ||
            typeof selector !== 'function')) {
          return origGetStats.apply(this, []);
        }

        const fixChromeStats_ = function(response) {
          const standardReport = {};
          const reports = response.result();
          reports.forEach(report => {
            const standardStats = {
              id: report.id,
              timestamp: report.timestamp,
              type: {
                localcandidate: 'local-candidate',
                remotecandidate: 'remote-candidate'
              }[report.type] || report.type
            };
            report.names().forEach(name => {
              standardStats[name] = report.stat(name);
            });
            standardReport[standardStats.id] = standardStats;
          });

          return standardReport;
        };

        // shim getStats with maplike support
        const makeMapStats = function(stats) {
          return new Map(Object.keys(stats).map(key => [key, stats[key]]));
        };

        if (arguments.length >= 2) {
          const successCallbackWrapper_ = function(response) {
            onSucc(makeMapStats(fixChromeStats_(response)));
          };

          return origGetStats.apply(this, [successCallbackWrapper_,
            selector]);
        }

        // promise-support
        return new Promise((resolve, reject) => {
          origGetStats.apply(this, [
            function(response) {
              resolve(makeMapStats(fixChromeStats_(response)));
            }, reject]);
        }).then(onSucc, onErr);
      };
    }

    function shimSenderReceiverGetStats(window) {
      if (!(typeof window === 'object' && window.RTCPeerConnection &&
          window.RTCRtpSender && window.RTCRtpReceiver)) {
        return;
      }

      // shim sender stats.
      if (!('getStats' in window.RTCRtpSender.prototype)) {
        const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
        if (origGetSenders) {
          window.RTCPeerConnection.prototype.getSenders = function getSenders() {
            const senders = origGetSenders.apply(this, []);
            senders.forEach(sender => sender._pc = this);
            return senders;
          };
        }

        const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        if (origAddTrack) {
          window.RTCPeerConnection.prototype.addTrack = function addTrack() {
            const sender = origAddTrack.apply(this, arguments);
            sender._pc = this;
            return sender;
          };
        }
        window.RTCRtpSender.prototype.getStats = function getStats() {
          const sender = this;
          return this._pc.getStats().then(result =>
            /* Note: this will include stats of all senders that
             *   send a track with the same id as sender.track as
             *   it is not possible to identify the RTCRtpSender.
             */
            filterStats(result, sender.track, true));
        };
      }

      // shim receiver stats.
      if (!('getStats' in window.RTCRtpReceiver.prototype)) {
        const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
        if (origGetReceivers) {
          window.RTCPeerConnection.prototype.getReceivers =
            function getReceivers() {
              const receivers = origGetReceivers.apply(this, []);
              receivers.forEach(receiver => receiver._pc = this);
              return receivers;
            };
        }
        wrapPeerConnectionEvent(window, 'track', e => {
          e.receiver._pc = e.srcElement;
          return e;
        });
        window.RTCRtpReceiver.prototype.getStats = function getStats() {
          const receiver = this;
          return this._pc.getStats().then(result =>
            filterStats(result, receiver.track, false));
        };
      }

      if (!('getStats' in window.RTCRtpSender.prototype &&
          'getStats' in window.RTCRtpReceiver.prototype)) {
        return;
      }

      // shim RTCPeerConnection.getStats(track).
      const origGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        if (arguments.length > 0 &&
            arguments[0] instanceof window.MediaStreamTrack) {
          const track = arguments[0];
          let sender;
          let receiver;
          let err;
          this.getSenders().forEach(s => {
            if (s.track === track) {
              if (sender) {
                err = true;
              } else {
                sender = s;
              }
            }
          });
          this.getReceivers().forEach(r => {
            if (r.track === track) {
              if (receiver) {
                err = true;
              } else {
                receiver = r;
              }
            }
            return r.track === track;
          });
          if (err || (sender && receiver)) {
            return Promise.reject(new DOMException(
              'There are more than one sender or receiver for the track.',
              'InvalidAccessError'));
          } else if (sender) {
            return sender.getStats();
          } else if (receiver) {
            return receiver.getStats();
          }
          return Promise.reject(new DOMException(
            'There is no sender or receiver for the track.',
            'InvalidAccessError'));
        }
        return origGetStats.apply(this, arguments);
      };
    }

    function shimAddTrackRemoveTrackWithNative(window) {
      // shim addTrack/removeTrack with native variants in order to make
      // the interactions with legacy getLocalStreams behave as in other browsers.
      // Keeps a mapping stream.id => [stream, rtpsenders...]
      window.RTCPeerConnection.prototype.getLocalStreams =
        function getLocalStreams() {
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};
          return Object.keys(this._shimmedLocalStreams)
            .map(streamId => this._shimmedLocalStreams[streamId][0]);
        };

      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          if (!stream) {
            return origAddTrack.apply(this, arguments);
          }
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};

          const sender = origAddTrack.apply(this, arguments);
          if (!this._shimmedLocalStreams[stream.id]) {
            this._shimmedLocalStreams[stream.id] = [stream, sender];
          } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
            this._shimmedLocalStreams[stream.id].push(sender);
          }
          return sender;
        };

      const origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._shimmedLocalStreams = this._shimmedLocalStreams || {};

        stream.getTracks().forEach(track => {
          const alreadyExists = this.getSenders().find(s => s.track === track);
          if (alreadyExists) {
            throw new DOMException('Track already exists.',
                'InvalidAccessError');
          }
        });
        const existingSenders = this.getSenders();
        origAddStream.apply(this, arguments);
        const newSenders = this.getSenders()
          .filter(newSender => existingSenders.indexOf(newSender) === -1);
        this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
      };

      const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};
          delete this._shimmedLocalStreams[stream.id];
          return origRemoveStream.apply(this, arguments);
        };

      const origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          this._shimmedLocalStreams = this._shimmedLocalStreams || {};
          if (sender) {
            Object.keys(this._shimmedLocalStreams).forEach(streamId => {
              const idx = this._shimmedLocalStreams[streamId].indexOf(sender);
              if (idx !== -1) {
                this._shimmedLocalStreams[streamId].splice(idx, 1);
              }
              if (this._shimmedLocalStreams[streamId].length === 1) {
                delete this._shimmedLocalStreams[streamId];
              }
            });
          }
          return origRemoveTrack.apply(this, arguments);
        };
    }

    function shimAddTrackRemoveTrack(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      const browserDetails = detectBrowser(window);
      // shim addTrack and removeTrack.
      if (window.RTCPeerConnection.prototype.addTrack &&
          browserDetails.version >= 65) {
        return shimAddTrackRemoveTrackWithNative(window);
      }

      // also shim pc.getLocalStreams when addTrack is shimmed
      // to return the original streams.
      const origGetLocalStreams = window.RTCPeerConnection.prototype
          .getLocalStreams;
      window.RTCPeerConnection.prototype.getLocalStreams =
        function getLocalStreams() {
          const nativeStreams = origGetLocalStreams.apply(this);
          this._reverseStreams = this._reverseStreams || {};
          return nativeStreams.map(stream => this._reverseStreams[stream.id]);
        };

      const origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
        this._streams = this._streams || {};
        this._reverseStreams = this._reverseStreams || {};

        stream.getTracks().forEach(track => {
          const alreadyExists = this.getSenders().find(s => s.track === track);
          if (alreadyExists) {
            throw new DOMException('Track already exists.',
                'InvalidAccessError');
          }
        });
        // Add identity mapping for consistency with addTrack.
        // Unless this is being used with a stream from addTrack.
        if (!this._reverseStreams[stream.id]) {
          const newStream = new window.MediaStream(stream.getTracks());
          this._streams[stream.id] = newStream;
          this._reverseStreams[newStream.id] = stream;
          stream = newStream;
        }
        origAddStream.apply(this, [stream]);
      };

      const origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          this._streams = this._streams || {};
          this._reverseStreams = this._reverseStreams || {};

          origRemoveStream.apply(this, [(this._streams[stream.id] || stream)]);
          delete this._reverseStreams[(this._streams[stream.id] ?
              this._streams[stream.id].id : stream.id)];
          delete this._streams[stream.id];
        };

      window.RTCPeerConnection.prototype.addTrack =
        function addTrack(track, stream) {
          if (this.signalingState === 'closed') {
            throw new DOMException(
              'The RTCPeerConnection\'s signalingState is \'closed\'.',
              'InvalidStateError');
          }
          const streams = [].slice.call(arguments, 1);
          if (streams.length !== 1 ||
              !streams[0].getTracks().find(t => t === track)) {
            // this is not fully correct but all we can manage without
            // [[associated MediaStreams]] internal slot.
            throw new DOMException(
              'The adapter.js addTrack polyfill only supports a single ' +
              ' stream which is associated with the specified track.',
              'NotSupportedError');
          }

          const alreadyExists = this.getSenders().find(s => s.track === track);
          if (alreadyExists) {
            throw new DOMException('Track already exists.',
                'InvalidAccessError');
          }

          this._streams = this._streams || {};
          this._reverseStreams = this._reverseStreams || {};
          const oldStream = this._streams[stream.id];
          if (oldStream) {
            // this is using odd Chrome behaviour, use with caution:
            // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
            // Note: we rely on the high-level addTrack/dtmf shim to
            // create the sender with a dtmf sender.
            oldStream.addTrack(track);

            // Trigger ONN async.
            Promise.resolve().then(() => {
              this.dispatchEvent(new Event('negotiationneeded'));
            });
          } else {
            const newStream = new window.MediaStream([track]);
            this._streams[stream.id] = newStream;
            this._reverseStreams[newStream.id] = stream;
            this.addStream(newStream);
          }
          return this.getSenders().find(s => s.track === track);
        };

      // replace the internal stream id with the external one and
      // vice versa.
      function replaceInternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(internalId => {
          const externalStream = pc._reverseStreams[internalId];
          const internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
              externalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp
        });
      }
      function replaceExternalStreamId(pc, description) {
        let sdp = description.sdp;
        Object.keys(pc._reverseStreams || []).forEach(internalId => {
          const externalStream = pc._reverseStreams[internalId];
          const internalStream = pc._streams[externalStream.id];
          sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
              internalStream.id);
        });
        return new RTCSessionDescription({
          type: description.type,
          sdp
        });
      }
      ['createOffer', 'createAnswer'].forEach(function(method) {
        const nativeMethod = window.RTCPeerConnection.prototype[method];
        const methodObj = {[method]() {
          const args = arguments;
          const isLegacyCall = arguments.length &&
              typeof arguments[0] === 'function';
          if (isLegacyCall) {
            return nativeMethod.apply(this, [
              (description) => {
                const desc = replaceInternalStreamId(this, description);
                args[0].apply(null, [desc]);
              },
              (err) => {
                if (args[1]) {
                  args[1].apply(null, err);
                }
              }, arguments[2]
            ]);
          }
          return nativeMethod.apply(this, arguments)
          .then(description => replaceInternalStreamId(this, description));
        }};
        window.RTCPeerConnection.prototype[method] = methodObj[method];
      });

      const origSetLocalDescription =
          window.RTCPeerConnection.prototype.setLocalDescription;
      window.RTCPeerConnection.prototype.setLocalDescription =
        function setLocalDescription() {
          if (!arguments.length || !arguments[0].type) {
            return origSetLocalDescription.apply(this, arguments);
          }
          arguments[0] = replaceExternalStreamId(this, arguments[0]);
          return origSetLocalDescription.apply(this, arguments);
        };

      // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

      const origLocalDescription = Object.getOwnPropertyDescriptor(
          window.RTCPeerConnection.prototype, 'localDescription');
      Object.defineProperty(window.RTCPeerConnection.prototype,
          'localDescription', {
            get() {
              const description = origLocalDescription.get.apply(this);
              if (description.type === '') {
                return description;
              }
              return replaceInternalStreamId(this, description);
            }
          });

      window.RTCPeerConnection.prototype.removeTrack =
        function removeTrack(sender) {
          if (this.signalingState === 'closed') {
            throw new DOMException(
              'The RTCPeerConnection\'s signalingState is \'closed\'.',
              'InvalidStateError');
          }
          // We can not yet check for sender instanceof RTCRtpSender
          // since we shim RTPSender. So we check if sender._pc is set.
          if (!sender._pc) {
            throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
                'does not implement interface RTCRtpSender.', 'TypeError');
          }
          const isLocal = sender._pc === this;
          if (!isLocal) {
            throw new DOMException('Sender was not created by this connection.',
                'InvalidAccessError');
          }

          // Search for the native stream the senders track belongs to.
          this._streams = this._streams || {};
          let stream;
          Object.keys(this._streams).forEach(streamid => {
            const hasTrack = this._streams[streamid].getTracks()
              .find(track => sender.track === track);
            if (hasTrack) {
              stream = this._streams[streamid];
            }
          });

          if (stream) {
            if (stream.getTracks().length === 1) {
              // if this is the last track of the stream, remove the stream. This
              // takes care of any shimmed _senders.
              this.removeStream(this._reverseStreams[stream.id]);
            } else {
              // relying on the same odd chrome behaviour as above.
              stream.removeTrack(sender.track);
            }
            this.dispatchEvent(new Event('negotiationneeded'));
          }
        };
    }

    function shimPeerConnection$2(window) {
      const browserDetails = detectBrowser(window);

      if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.webkitRTCPeerConnection;
      }
      if (!window.RTCPeerConnection) {
        return;
      }

      const addIceCandidateNullSupported =
        window.RTCPeerConnection.prototype.addIceCandidate.length === 0;

      // shim implicit creation of RTCSessionDescription/RTCIceCandidate
      if (browserDetails.version < 53) {
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
            .forEach(function(method) {
              const nativeMethod = window.RTCPeerConnection.prototype[method];
              const methodObj = {[method]() {
                arguments[0] = new ((method === 'addIceCandidate') ?
                    window.RTCIceCandidate :
                    window.RTCSessionDescription)(arguments[0]);
                return nativeMethod.apply(this, arguments);
              }};
              window.RTCPeerConnection.prototype[method] = methodObj[method];
            });
      }

      // support for addIceCandidate(null or undefined)
      const nativeAddIceCandidate =
          window.RTCPeerConnection.prototype.addIceCandidate;
      window.RTCPeerConnection.prototype.addIceCandidate =
        function addIceCandidate() {
          if (!addIceCandidateNullSupported && !arguments[0]) {
            if (arguments[1]) {
              arguments[1].apply(null);
            }
            return Promise.resolve();
          }
          // Firefox 68+ emits and processes {candidate: "", ...}, ignore
          // in older versions. Native support planned for Chrome M77.
          if (browserDetails.version < 78 &&
            arguments[0] && arguments[0].candidate === '') {
            return Promise.resolve();
          }
          return nativeAddIceCandidate.apply(this, arguments);
        };
    }

    // Attempt to fix ONN in plan-b mode.
    function fixNegotiationNeeded(window) {
      const browserDetails = detectBrowser(window);
      wrapPeerConnectionEvent(window, 'negotiationneeded', e => {
        const pc = e.target;
        if (browserDetails.version < 72 || (pc.getConfiguration &&
            pc.getConfiguration().sdpSemantics === 'plan-b')) {
          if (pc.signalingState !== 'stable') {
            return;
          }
        }
        return e;
      });
    }

    var chromeShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimMediaStream: shimMediaStream,
        shimOnTrack: shimOnTrack$1,
        shimGetSendersWithDtmf: shimGetSendersWithDtmf,
        shimGetStats: shimGetStats,
        shimSenderReceiverGetStats: shimSenderReceiverGetStats,
        shimAddTrackRemoveTrackWithNative: shimAddTrackRemoveTrackWithNative,
        shimAddTrackRemoveTrack: shimAddTrackRemoveTrack,
        shimPeerConnection: shimPeerConnection$2,
        fixNegotiationNeeded: fixNegotiationNeeded,
        shimGetUserMedia: shimGetUserMedia$3,
        shimGetDisplayMedia: shimGetDisplayMedia$2
    });

    /*
     *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */
    // Edge does not like
    // 1) stun: filtered after 14393 unless ?transport=udp is present
    // 2) turn: that does not have all of turn:host:port?transport=udp
    // 3) turn: with ipv6 addresses
    // 4) turn: occurring muliple times
    function filterIceServers$1(iceServers, edgeVersion) {
      let hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(server => {
        if (server && (server.urls || server.url)) {
          let urls = server.urls || server.url;
          if (server.url && !server.urls) {
            deprecated('RTCIceServer.url', 'RTCIceServer.urls');
          }
          const isString = typeof urls === 'string';
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(url => {
            // filter STUN unconditionally.
            if (url.indexOf('stun:') === 0) {
              return false;
            }

            const validTurn = url.startsWith('turn') &&
                !url.startsWith('turn:[') &&
                url.includes('transport=udp');
            if (validTurn && !hasTurn) {
              hasTurn = true;
              return true;
            }
            return validTurn && !hasTurn;
          });

          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /* eslint-env node */

    var sdp = createCommonjsModule(function (module) {

    // SDP helpers.
    var SDPUtils = {};

    // Generate an alphanumeric identifier for cname or mids.
    // TODO: use UUIDs instead? https://gist.github.com/jed/982883
    SDPUtils.generateIdentifier = function() {
      return Math.random().toString(36).substr(2, 10);
    };

    // The RTCP CNAME used by all peerconnections from the same JS.
    SDPUtils.localCName = SDPUtils.generateIdentifier();

    // Splits SDP into lines, dealing with both CRLF and LF.
    SDPUtils.splitLines = function(blob) {
      return blob.trim().split('\n').map(function(line) {
        return line.trim();
      });
    };
    // Splits SDP into sessionpart and mediasections. Ensures CRLF.
    SDPUtils.splitSections = function(blob) {
      var parts = blob.split('\nm=');
      return parts.map(function(part, index) {
        return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
      });
    };

    // returns the session description.
    SDPUtils.getDescription = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      return sections && sections[0];
    };

    // returns the individual media sections.
    SDPUtils.getMediaSections = function(blob) {
      var sections = SDPUtils.splitSections(blob);
      sections.shift();
      return sections;
    };

    // Returns lines that start with a certain prefix.
    SDPUtils.matchPrefix = function(blob, prefix) {
      return SDPUtils.splitLines(blob).filter(function(line) {
        return line.indexOf(prefix) === 0;
      });
    };

    // Parses an ICE candidate line. Sample input:
    // candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
    // rport 55996"
    SDPUtils.parseCandidate = function(line) {
      var parts;
      // Parse both variants.
      if (line.indexOf('a=candidate:') === 0) {
        parts = line.substring(12).split(' ');
      } else {
        parts = line.substring(10).split(' ');
      }

      var candidate = {
        foundation: parts[0],
        component: parseInt(parts[1], 10),
        protocol: parts[2].toLowerCase(),
        priority: parseInt(parts[3], 10),
        ip: parts[4],
        address: parts[4], // address is an alias for ip.
        port: parseInt(parts[5], 10),
        // skip parts[6] == 'typ'
        type: parts[7]
      };

      for (var i = 8; i < parts.length; i += 2) {
        switch (parts[i]) {
          case 'raddr':
            candidate.relatedAddress = parts[i + 1];
            break;
          case 'rport':
            candidate.relatedPort = parseInt(parts[i + 1], 10);
            break;
          case 'tcptype':
            candidate.tcpType = parts[i + 1];
            break;
          case 'ufrag':
            candidate.ufrag = parts[i + 1]; // for backward compability.
            candidate.usernameFragment = parts[i + 1];
            break;
          default: // extension handling, in particular ufrag
            candidate[parts[i]] = parts[i + 1];
            break;
        }
      }
      return candidate;
    };

    // Translates a candidate object into SDP candidate attribute.
    SDPUtils.writeCandidate = function(candidate) {
      var sdp = [];
      sdp.push(candidate.foundation);
      sdp.push(candidate.component);
      sdp.push(candidate.protocol.toUpperCase());
      sdp.push(candidate.priority);
      sdp.push(candidate.address || candidate.ip);
      sdp.push(candidate.port);

      var type = candidate.type;
      sdp.push('typ');
      sdp.push(type);
      if (type !== 'host' && candidate.relatedAddress &&
          candidate.relatedPort) {
        sdp.push('raddr');
        sdp.push(candidate.relatedAddress);
        sdp.push('rport');
        sdp.push(candidate.relatedPort);
      }
      if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
        sdp.push('tcptype');
        sdp.push(candidate.tcpType);
      }
      if (candidate.usernameFragment || candidate.ufrag) {
        sdp.push('ufrag');
        sdp.push(candidate.usernameFragment || candidate.ufrag);
      }
      return 'candidate:' + sdp.join(' ');
    };

    // Parses an ice-options line, returns an array of option tags.
    // a=ice-options:foo bar
    SDPUtils.parseIceOptions = function(line) {
      return line.substr(14).split(' ');
    };

    // Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
    // a=rtpmap:111 opus/48000/2
    SDPUtils.parseRtpMap = function(line) {
      var parts = line.substr(9).split(' ');
      var parsed = {
        payloadType: parseInt(parts.shift(), 10) // was: id
      };

      parts = parts[0].split('/');

      parsed.name = parts[0];
      parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
      parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      // legacy alias, got renamed back to channels in ORTC.
      parsed.numChannels = parsed.channels;
      return parsed;
    };

    // Generate an a=rtpmap line from RTCRtpCodecCapability or
    // RTCRtpCodecParameters.
    SDPUtils.writeRtpMap = function(codec) {
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      var channels = codec.channels || codec.numChannels || 1;
      return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
          (channels !== 1 ? '/' + channels : '') + '\r\n';
    };

    // Parses an a=extmap line (headerextension from RFC 5285). Sample input:
    // a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
    // a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
    SDPUtils.parseExtmap = function(line) {
      var parts = line.substr(9).split(' ');
      return {
        id: parseInt(parts[0], 10),
        direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
        uri: parts[1]
      };
    };

    // Generates a=extmap line from RTCRtpHeaderExtensionParameters or
    // RTCRtpHeaderExtension.
    SDPUtils.writeExtmap = function(headerExtension) {
      return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
          (headerExtension.direction && headerExtension.direction !== 'sendrecv'
            ? '/' + headerExtension.direction
            : '') +
          ' ' + headerExtension.uri + '\r\n';
    };

    // Parses an ftmp line, returns dictionary. Sample input:
    // a=fmtp:96 vbr=on;cng=on
    // Also deals with vbr=on; cng=on
    SDPUtils.parseFmtp = function(line) {
      var parsed = {};
      var kv;
      var parts = line.substr(line.indexOf(' ') + 1).split(';');
      for (var j = 0; j < parts.length; j++) {
        kv = parts[j].trim().split('=');
        parsed[kv[0].trim()] = kv[1];
      }
      return parsed;
    };

    // Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeFmtp = function(codec) {
      var line = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.parameters && Object.keys(codec.parameters).length) {
        var params = [];
        Object.keys(codec.parameters).forEach(function(param) {
          if (codec.parameters[param]) {
            params.push(param + '=' + codec.parameters[param]);
          } else {
            params.push(param);
          }
        });
        line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
      }
      return line;
    };

    // Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
    // a=rtcp-fb:98 nack rpsi
    SDPUtils.parseRtcpFb = function(line) {
      var parts = line.substr(line.indexOf(' ') + 1).split(' ');
      return {
        type: parts.shift(),
        parameter: parts.join(' ')
      };
    };
    // Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
    SDPUtils.writeRtcpFb = function(codec) {
      var lines = '';
      var pt = codec.payloadType;
      if (codec.preferredPayloadType !== undefined) {
        pt = codec.preferredPayloadType;
      }
      if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
        // FIXME: special handling for trr-int?
        codec.rtcpFeedback.forEach(function(fb) {
          lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
          (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
              '\r\n';
        });
      }
      return lines;
    };

    // Parses an RFC 5576 ssrc media attribute. Sample input:
    // a=ssrc:3735928559 cname:something
    SDPUtils.parseSsrcMedia = function(line) {
      var sp = line.indexOf(' ');
      var parts = {
        ssrc: parseInt(line.substr(7, sp - 7), 10)
      };
      var colon = line.indexOf(':', sp);
      if (colon > -1) {
        parts.attribute = line.substr(sp + 1, colon - sp - 1);
        parts.value = line.substr(colon + 1);
      } else {
        parts.attribute = line.substr(sp + 1);
      }
      return parts;
    };

    SDPUtils.parseSsrcGroup = function(line) {
      var parts = line.substr(13).split(' ');
      return {
        semantics: parts.shift(),
        ssrcs: parts.map(function(ssrc) {
          return parseInt(ssrc, 10);
        })
      };
    };

    // Extracts the MID (RFC 5888) from a media section.
    // returns the MID or undefined if no mid line was found.
    SDPUtils.getMid = function(mediaSection) {
      var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
      if (mid) {
        return mid.substr(6);
      }
    };

    SDPUtils.parseFingerprint = function(line) {
      var parts = line.substr(14).split(' ');
      return {
        algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
        value: parts[1]
      };
    };

    // Extracts DTLS parameters from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the fingerprint line as input. See also getIceParameters.
    SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=fingerprint:');
      // Note: a=setup line is ignored since we use the 'auto' role.
      // Note2: 'algorithm' is not case sensitive except in Edge.
      return {
        role: 'auto',
        fingerprints: lines.map(SDPUtils.parseFingerprint)
      };
    };

    // Serializes DTLS parameters to SDP.
    SDPUtils.writeDtlsParameters = function(params, setupType) {
      var sdp = 'a=setup:' + setupType + '\r\n';
      params.fingerprints.forEach(function(fp) {
        sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
      });
      return sdp;
    };

    // Parses a=crypto lines into
    //   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#dictionary-rtcsrtpsdesparameters-members
    SDPUtils.parseCryptoLine = function(line) {
      var parts = line.substr(9).split(' ');
      return {
        tag: parseInt(parts[0], 10),
        cryptoSuite: parts[1],
        keyParams: parts[2],
        sessionParams: parts.slice(3),
      };
    };

    SDPUtils.writeCryptoLine = function(parameters) {
      return 'a=crypto:' + parameters.tag + ' ' +
        parameters.cryptoSuite + ' ' +
        (typeof parameters.keyParams === 'object'
          ? SDPUtils.writeCryptoKeyParams(parameters.keyParams)
          : parameters.keyParams) +
        (parameters.sessionParams ? ' ' + parameters.sessionParams.join(' ') : '') +
        '\r\n';
    };

    // Parses the crypto key parameters into
    //   https://rawgit.com/aboba/edgertc/master/msortc-rs4.html#rtcsrtpkeyparam*
    SDPUtils.parseCryptoKeyParams = function(keyParams) {
      if (keyParams.indexOf('inline:') !== 0) {
        return null;
      }
      var parts = keyParams.substr(7).split('|');
      return {
        keyMethod: 'inline',
        keySalt: parts[0],
        lifeTime: parts[1],
        mkiValue: parts[2] ? parts[2].split(':')[0] : undefined,
        mkiLength: parts[2] ? parts[2].split(':')[1] : undefined,
      };
    };

    SDPUtils.writeCryptoKeyParams = function(keyParams) {
      return keyParams.keyMethod + ':'
        + keyParams.keySalt +
        (keyParams.lifeTime ? '|' + keyParams.lifeTime : '') +
        (keyParams.mkiValue && keyParams.mkiLength
          ? '|' + keyParams.mkiValue + ':' + keyParams.mkiLength
          : '');
    };

    // Extracts all SDES paramters.
    SDPUtils.getCryptoParameters = function(mediaSection, sessionpart) {
      var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=crypto:');
      return lines.map(SDPUtils.parseCryptoLine);
    };

    // Parses ICE information from SDP media section or sessionpart.
    // FIXME: for consistency with other functions this should only
    //   get the ice-ufrag and ice-pwd lines as input.
    SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
      var ufrag = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=ice-ufrag:')[0];
      var pwd = SDPUtils.matchPrefix(mediaSection + sessionpart,
        'a=ice-pwd:')[0];
      if (!(ufrag && pwd)) {
        return null;
      }
      return {
        usernameFragment: ufrag.substr(12),
        password: pwd.substr(10),
      };
    };

    // Serializes ICE parameters to SDP.
    SDPUtils.writeIceParameters = function(params) {
      return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
          'a=ice-pwd:' + params.password + '\r\n';
    };

    // Parses the SDP media section and returns RTCRtpParameters.
    SDPUtils.parseRtpParameters = function(mediaSection) {
      var description = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: [],
        rtcp: []
      };
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
        var pt = mline[i];
        var rtpmapline = SDPUtils.matchPrefix(
          mediaSection, 'a=rtpmap:' + pt + ' ')[0];
        if (rtpmapline) {
          var codec = SDPUtils.parseRtpMap(rtpmapline);
          var fmtps = SDPUtils.matchPrefix(
            mediaSection, 'a=fmtp:' + pt + ' ');
          // Only the first a=fmtp:<pt> is considered.
          codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
          codec.rtcpFeedback = SDPUtils.matchPrefix(
            mediaSection, 'a=rtcp-fb:' + pt + ' ')
            .map(SDPUtils.parseRtcpFb);
          description.codecs.push(codec);
          // parse FEC mechanisms from rtpmap lines.
          switch (codec.name.toUpperCase()) {
            case 'RED':
            case 'ULPFEC':
              description.fecMechanisms.push(codec.name.toUpperCase());
              break;
          }
        }
      }
      SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
        description.headerExtensions.push(SDPUtils.parseExtmap(line));
      });
      // FIXME: parse rtcp.
      return description;
    };

    // Generates parts of the SDP media section describing the capabilities /
    // parameters.
    SDPUtils.writeRtpDescription = function(kind, caps) {
      var sdp = '';

      // Build the mline.
      sdp += 'm=' + kind + ' ';
      sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
      sdp += ' UDP/TLS/RTP/SAVPF ';
      sdp += caps.codecs.map(function(codec) {
        if (codec.preferredPayloadType !== undefined) {
          return codec.preferredPayloadType;
        }
        return codec.payloadType;
      }).join(' ') + '\r\n';

      sdp += 'c=IN IP4 0.0.0.0\r\n';
      sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

      // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
      caps.codecs.forEach(function(codec) {
        sdp += SDPUtils.writeRtpMap(codec);
        sdp += SDPUtils.writeFmtp(codec);
        sdp += SDPUtils.writeRtcpFb(codec);
      });
      var maxptime = 0;
      caps.codecs.forEach(function(codec) {
        if (codec.maxptime > maxptime) {
          maxptime = codec.maxptime;
        }
      });
      if (maxptime > 0) {
        sdp += 'a=maxptime:' + maxptime + '\r\n';
      }
      sdp += 'a=rtcp-mux\r\n';

      if (caps.headerExtensions) {
        caps.headerExtensions.forEach(function(extension) {
          sdp += SDPUtils.writeExtmap(extension);
        });
      }
      // FIXME: write fecMechanisms.
      return sdp;
    };

    // Parses the SDP media section and returns an array of
    // RTCRtpEncodingParameters.
    SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
      var encodingParameters = [];
      var description = SDPUtils.parseRtpParameters(mediaSection);
      var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
      var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

      // filter a=ssrc:... cname:, ignore PlanB-msid
      var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
        .map(function(line) {
          return SDPUtils.parseSsrcMedia(line);
        })
        .filter(function(parts) {
          return parts.attribute === 'cname';
        });
      var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
      var secondarySsrc;

      var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
        .map(function(line) {
          var parts = line.substr(17).split(' ');
          return parts.map(function(part) {
            return parseInt(part, 10);
          });
        });
      if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
        secondarySsrc = flows[0][1];
      }

      description.codecs.forEach(function(codec) {
        if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
          var encParam = {
            ssrc: primarySsrc,
            codecPayloadType: parseInt(codec.parameters.apt, 10)
          };
          if (primarySsrc && secondarySsrc) {
            encParam.rtx = {ssrc: secondarySsrc};
          }
          encodingParameters.push(encParam);
          if (hasRed) {
            encParam = JSON.parse(JSON.stringify(encParam));
            encParam.fec = {
              ssrc: primarySsrc,
              mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
            };
            encodingParameters.push(encParam);
          }
        }
      });
      if (encodingParameters.length === 0 && primarySsrc) {
        encodingParameters.push({
          ssrc: primarySsrc
        });
      }

      // we support both b=AS and b=TIAS but interpret AS as TIAS.
      var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
      if (bandwidth.length) {
        if (bandwidth[0].indexOf('b=TIAS:') === 0) {
          bandwidth = parseInt(bandwidth[0].substr(7), 10);
        } else if (bandwidth[0].indexOf('b=AS:') === 0) {
          // use formula from JSEP to convert b=AS to TIAS value.
          bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
              - (50 * 40 * 8);
        } else {
          bandwidth = undefined;
        }
        encodingParameters.forEach(function(params) {
          params.maxBitrate = bandwidth;
        });
      }
      return encodingParameters;
    };

    // parses http://draft.ortc.org/#rtcrtcpparameters*
    SDPUtils.parseRtcpParameters = function(mediaSection) {
      var rtcpParameters = {};

      // Gets the first SSRC. Note tha with RTX there might be multiple
      // SSRCs.
      var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
        .map(function(line) {
          return SDPUtils.parseSsrcMedia(line);
        })
        .filter(function(obj) {
          return obj.attribute === 'cname';
        })[0];
      if (remoteSsrc) {
        rtcpParameters.cname = remoteSsrc.value;
        rtcpParameters.ssrc = remoteSsrc.ssrc;
      }

      // Edge uses the compound attribute instead of reducedSize
      // compound is !reducedSize
      var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
      rtcpParameters.reducedSize = rsize.length > 0;
      rtcpParameters.compound = rsize.length === 0;

      // parses the rtcp-mux attrіbute.
      // Note that Edge does not support unmuxed RTCP.
      var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
      rtcpParameters.mux = mux.length > 0;

      return rtcpParameters;
    };

    // parses either a=msid: or a=ssrc:... msid lines and returns
    // the id of the MediaStream and MediaStreamTrack.
    SDPUtils.parseMsid = function(mediaSection) {
      var parts;
      var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
      if (spec.length === 1) {
        parts = spec[0].substr(7).split(' ');
        return {stream: parts[0], track: parts[1]};
      }
      var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
        .map(function(line) {
          return SDPUtils.parseSsrcMedia(line);
        })
        .filter(function(msidParts) {
          return msidParts.attribute === 'msid';
        });
      if (planB.length > 0) {
        parts = planB[0].value.split(' ');
        return {stream: parts[0], track: parts[1]};
      }
    };

    // SCTP
    // parses draft-ietf-mmusic-sctp-sdp-26 first and falls back
    // to draft-ietf-mmusic-sctp-sdp-05
    SDPUtils.parseSctpDescription = function(mediaSection) {
      var mline = SDPUtils.parseMLine(mediaSection);
      var maxSizeLine = SDPUtils.matchPrefix(mediaSection, 'a=max-message-size:');
      var maxMessageSize;
      if (maxSizeLine.length > 0) {
        maxMessageSize = parseInt(maxSizeLine[0].substr(19), 10);
      }
      if (isNaN(maxMessageSize)) {
        maxMessageSize = 65536;
      }
      var sctpPort = SDPUtils.matchPrefix(mediaSection, 'a=sctp-port:');
      if (sctpPort.length > 0) {
        return {
          port: parseInt(sctpPort[0].substr(12), 10),
          protocol: mline.fmt,
          maxMessageSize: maxMessageSize
        };
      }
      var sctpMapLines = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:');
      if (sctpMapLines.length > 0) {
        var parts = SDPUtils.matchPrefix(mediaSection, 'a=sctpmap:')[0]
          .substr(10)
          .split(' ');
        return {
          port: parseInt(parts[0], 10),
          protocol: parts[1],
          maxMessageSize: maxMessageSize
        };
      }
    };

    // SCTP
    // outputs the draft-ietf-mmusic-sctp-sdp-26 version that all browsers
    // support by now receiving in this format, unless we originally parsed
    // as the draft-ietf-mmusic-sctp-sdp-05 format (indicated by the m-line
    // protocol of DTLS/SCTP -- without UDP/ or TCP/)
    SDPUtils.writeSctpDescription = function(media, sctp) {
      var output = [];
      if (media.protocol !== 'DTLS/SCTP') {
        output = [
          'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.protocol + '\r\n',
          'c=IN IP4 0.0.0.0\r\n',
          'a=sctp-port:' + sctp.port + '\r\n'
        ];
      } else {
        output = [
          'm=' + media.kind + ' 9 ' + media.protocol + ' ' + sctp.port + '\r\n',
          'c=IN IP4 0.0.0.0\r\n',
          'a=sctpmap:' + sctp.port + ' ' + sctp.protocol + ' 65535\r\n'
        ];
      }
      if (sctp.maxMessageSize !== undefined) {
        output.push('a=max-message-size:' + sctp.maxMessageSize + '\r\n');
      }
      return output.join('');
    };

    // Generate a session ID for SDP.
    // https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
    // recommends using a cryptographically random +ve 64-bit value
    // but right now this should be acceptable and within the right range
    SDPUtils.generateSessionId = function() {
      return Math.random().toString().substr(2, 21);
    };

    // Write boilder plate for start of SDP
    // sessId argument is optional - if not supplied it will
    // be generated randomly
    // sessVersion is optional and defaults to 2
    // sessUser is optional and defaults to 'thisisadapterortc'
    SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
      var sessionId;
      var version = sessVer !== undefined ? sessVer : 2;
      if (sessId) {
        sessionId = sessId;
      } else {
        sessionId = SDPUtils.generateSessionId();
      }
      var user = sessUser || 'thisisadapterortc';
      // FIXME: sess-id should be an NTP timestamp.
      return 'v=0\r\n' +
          'o=' + user + ' ' + sessionId + ' ' + version +
            ' IN IP4 127.0.0.1\r\n' +
          's=-\r\n' +
          't=0 0\r\n';
    };

    SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
      var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp += SDPUtils.writeIceParameters(
        transceiver.iceGatherer.getLocalParameters());

      // Map DTLS parameters to SDP.
      sdp += SDPUtils.writeDtlsParameters(
        transceiver.dtlsTransport.getLocalParameters(),
        type === 'offer' ? 'actpass' : 'active');

      sdp += 'a=mid:' + transceiver.mid + '\r\n';

      if (transceiver.direction) {
        sdp += 'a=' + transceiver.direction + '\r\n';
      } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp += 'a=recvonly\r\n';
      } else {
        sdp += 'a=inactive\r\n';
      }

      if (transceiver.rtpSender) {
        // spec.
        var msid = 'msid:' + stream.id + ' ' +
            transceiver.rtpSender.track.id + '\r\n';
        sdp += 'a=' + msid;

        // for Chrome.
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
            ' ' + msid;
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
              ' ' + msid;
          sdp += 'a=ssrc-group:FID ' +
              transceiver.sendEncodingParameters[0].ssrc + ' ' +
              transceiver.sendEncodingParameters[0].rtx.ssrc +
              '\r\n';
        }
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' cname:' + SDPUtils.localCName + '\r\n';
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' cname:' + SDPUtils.localCName + '\r\n';
      }
      return sdp;
    };

    // Gets the direction from the mediaSection or the sessionpart.
    SDPUtils.getDirection = function(mediaSection, sessionpart) {
      // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
      var lines = SDPUtils.splitLines(mediaSection);
      for (var i = 0; i < lines.length; i++) {
        switch (lines[i]) {
          case 'a=sendrecv':
          case 'a=sendonly':
          case 'a=recvonly':
          case 'a=inactive':
            return lines[i].substr(2);
            // FIXME: What should happen here?
        }
      }
      if (sessionpart) {
        return SDPUtils.getDirection(sessionpart);
      }
      return 'sendrecv';
    };

    SDPUtils.getKind = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var mline = lines[0].split(' ');
      return mline[0].substr(2);
    };

    SDPUtils.isRejected = function(mediaSection) {
      return mediaSection.split(' ', 2)[1] === '0';
    };

    SDPUtils.parseMLine = function(mediaSection) {
      var lines = SDPUtils.splitLines(mediaSection);
      var parts = lines[0].substr(2).split(' ');
      return {
        kind: parts[0],
        port: parseInt(parts[1], 10),
        protocol: parts[2],
        fmt: parts.slice(3).join(' ')
      };
    };

    SDPUtils.parseOLine = function(mediaSection) {
      var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
      var parts = line.substr(2).split(' ');
      return {
        username: parts[0],
        sessionId: parts[1],
        sessionVersion: parseInt(parts[2], 10),
        netType: parts[3],
        addressType: parts[4],
        address: parts[5]
      };
    };

    // a very naive interpretation of a valid SDP.
    SDPUtils.isValidSDP = function(blob) {
      if (typeof blob !== 'string' || blob.length === 0) {
        return false;
      }
      var lines = SDPUtils.splitLines(blob);
      for (var i = 0; i < lines.length; i++) {
        if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
          return false;
        }
        // TODO: check the modifier a bit more.
      }
      return true;
    };

    // Expose public methods.
    {
      module.exports = SDPUtils;
    }
    });

    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */



    function fixStatsType(stat) {
      return {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      }[stat.type] || stat.type;
    }

    function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
      var sdp$1 = sdp.writeRtpDescription(transceiver.kind, caps);

      // Map ICE parameters (ufrag, pwd) to SDP.
      sdp$1 += sdp.writeIceParameters(
          transceiver.iceGatherer.getLocalParameters());

      // Map DTLS parameters to SDP.
      sdp$1 += sdp.writeDtlsParameters(
          transceiver.dtlsTransport.getLocalParameters(),
          type === 'offer' ? 'actpass' : dtlsRole || 'active');

      sdp$1 += 'a=mid:' + transceiver.mid + '\r\n';

      if (transceiver.rtpSender && transceiver.rtpReceiver) {
        sdp$1 += 'a=sendrecv\r\n';
      } else if (transceiver.rtpSender) {
        sdp$1 += 'a=sendonly\r\n';
      } else if (transceiver.rtpReceiver) {
        sdp$1 += 'a=recvonly\r\n';
      } else {
        sdp$1 += 'a=inactive\r\n';
      }

      if (transceiver.rtpSender) {
        var trackId = transceiver.rtpSender._initialTrackId ||
            transceiver.rtpSender.track.id;
        transceiver.rtpSender._initialTrackId = trackId;
        // spec.
        var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
            trackId + '\r\n';
        sdp$1 += 'a=' + msid;
        // for Chrome. Legacy should no longer be required.
        sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
            ' ' + msid;

        // RTX
        if (transceiver.sendEncodingParameters[0].rtx) {
          sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
              ' ' + msid;
          sdp$1 += 'a=ssrc-group:FID ' +
              transceiver.sendEncodingParameters[0].ssrc + ' ' +
              transceiver.sendEncodingParameters[0].rtx.ssrc +
              '\r\n';
        }
      }
      // FIXME: this should be written by writeRtpDescription.
      sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
          ' cname:' + sdp.localCName + '\r\n';
      if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
        sdp$1 += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
            ' cname:' + sdp.localCName + '\r\n';
      }
      return sdp$1;
    }

    // Edge does not like
    // 1) stun: filtered after 14393 unless ?transport=udp is present
    // 2) turn: that does not have all of turn:host:port?transport=udp
    // 3) turn: with ipv6 addresses
    // 4) turn: occurring muliple times
    function filterIceServers(iceServers, edgeVersion) {
      var hasTurn = false;
      iceServers = JSON.parse(JSON.stringify(iceServers));
      return iceServers.filter(function(server) {
        if (server && (server.urls || server.url)) {
          var urls = server.urls || server.url;
          if (server.url && !server.urls) {
            console.warn('RTCIceServer.url is deprecated! Use urls instead.');
          }
          var isString = typeof urls === 'string';
          if (isString) {
            urls = [urls];
          }
          urls = urls.filter(function(url) {
            var validTurn = url.indexOf('turn:') === 0 &&
                url.indexOf('transport=udp') !== -1 &&
                url.indexOf('turn:[') === -1 &&
                !hasTurn;

            if (validTurn) {
              hasTurn = true;
              return true;
            }
            return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
                url.indexOf('?transport=udp') === -1;
          });

          delete server.url;
          server.urls = isString ? urls[0] : urls;
          return !!urls.length;
        }
      });
    }

    // Determines the intersection of local and remote capabilities.
    function getCommonCapabilities(localCapabilities, remoteCapabilities) {
      var commonCapabilities = {
        codecs: [],
        headerExtensions: [],
        fecMechanisms: []
      };

      var findCodecByPayloadType = function(pt, codecs) {
        pt = parseInt(pt, 10);
        for (var i = 0; i < codecs.length; i++) {
          if (codecs[i].payloadType === pt ||
              codecs[i].preferredPayloadType === pt) {
            return codecs[i];
          }
        }
      };

      var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
        var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
        var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
        return lCodec && rCodec &&
            lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
      };

      localCapabilities.codecs.forEach(function(lCodec) {
        for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
          var rCodec = remoteCapabilities.codecs[i];
          if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
              lCodec.clockRate === rCodec.clockRate) {
            if (lCodec.name.toLowerCase() === 'rtx' &&
                lCodec.parameters && rCodec.parameters.apt) {
              // for RTX we need to find the local rtx that has a apt
              // which points to the same local codec as the remote one.
              if (!rtxCapabilityMatches(lCodec, rCodec,
                  localCapabilities.codecs, remoteCapabilities.codecs)) {
                continue;
              }
            }
            rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
            // number of channels is the highest common number of channels
            rCodec.numChannels = Math.min(lCodec.numChannels,
                rCodec.numChannels);
            // push rCodec so we reply with offerer payload type
            commonCapabilities.codecs.push(rCodec);

            // determine common feedback mechanisms
            rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
              for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
                if (lCodec.rtcpFeedback[j].type === fb.type &&
                    lCodec.rtcpFeedback[j].parameter === fb.parameter) {
                  return true;
                }
              }
              return false;
            });
            // FIXME: also need to determine .parameters
            //  see https://github.com/openpeer/ortc/issues/569
            break;
          }
        }
      });

      localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
        for (var i = 0; i < remoteCapabilities.headerExtensions.length;
             i++) {
          var rHeaderExtension = remoteCapabilities.headerExtensions[i];
          if (lHeaderExtension.uri === rHeaderExtension.uri) {
            commonCapabilities.headerExtensions.push(rHeaderExtension);
            break;
          }
        }
      });

      // FIXME: fecMechanisms
      return commonCapabilities;
    }

    // is action=setLocalDescription with type allowed in signalingState
    function isActionAllowedInSignalingState(action, type, signalingState) {
      return {
        offer: {
          setLocalDescription: ['stable', 'have-local-offer'],
          setRemoteDescription: ['stable', 'have-remote-offer']
        },
        answer: {
          setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
          setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
        }
      }[type][action].indexOf(signalingState) !== -1;
    }

    function maybeAddCandidate(iceTransport, candidate) {
      // Edge's internal representation adds some fields therefore
      // not all fieldѕ are taken into account.
      var alreadyAdded = iceTransport.getRemoteCandidates()
          .find(function(remoteCandidate) {
            return candidate.foundation === remoteCandidate.foundation &&
                candidate.ip === remoteCandidate.ip &&
                candidate.port === remoteCandidate.port &&
                candidate.priority === remoteCandidate.priority &&
                candidate.protocol === remoteCandidate.protocol &&
                candidate.type === remoteCandidate.type;
          });
      if (!alreadyAdded) {
        iceTransport.addRemoteCandidate(candidate);
      }
      return !alreadyAdded;
    }


    function makeError(name, description) {
      var e = new Error(description);
      e.name = name;
      // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
      e.code = {
        NotSupportedError: 9,
        InvalidStateError: 11,
        InvalidAccessError: 15,
        TypeError: undefined,
        OperationError: undefined
      }[name];
      return e;
    }

    var rtcpeerconnection = function(window, edgeVersion) {
      // https://w3c.github.io/mediacapture-main/#mediastream
      // Helper function to add the track to the stream and
      // dispatch the event ourselves.
      function addTrackToStreamAndFireEvent(track, stream) {
        stream.addTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
            {track: track}));
      }

      function removeTrackFromStreamAndFireEvent(track, stream) {
        stream.removeTrack(track);
        stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
            {track: track}));
      }

      function fireAddTrack(pc, track, receiver, streams) {
        var trackEvent = new Event('track');
        trackEvent.track = track;
        trackEvent.receiver = receiver;
        trackEvent.transceiver = {receiver: receiver};
        trackEvent.streams = streams;
        window.setTimeout(function() {
          pc._dispatchEvent('track', trackEvent);
        });
      }

      var RTCPeerConnection = function(config) {
        var pc = this;

        var _eventTarget = document.createDocumentFragment();
        ['addEventListener', 'removeEventListener', 'dispatchEvent']
            .forEach(function(method) {
              pc[method] = _eventTarget[method].bind(_eventTarget);
            });

        this.canTrickleIceCandidates = null;

        this.needNegotiation = false;

        this.localStreams = [];
        this.remoteStreams = [];

        this._localDescription = null;
        this._remoteDescription = null;

        this.signalingState = 'stable';
        this.iceConnectionState = 'new';
        this.connectionState = 'new';
        this.iceGatheringState = 'new';

        config = JSON.parse(JSON.stringify(config || {}));

        this.usingBundle = config.bundlePolicy === 'max-bundle';
        if (config.rtcpMuxPolicy === 'negotiate') {
          throw(makeError('NotSupportedError',
              'rtcpMuxPolicy \'negotiate\' is not supported'));
        } else if (!config.rtcpMuxPolicy) {
          config.rtcpMuxPolicy = 'require';
        }

        switch (config.iceTransportPolicy) {
          case 'all':
          case 'relay':
            break;
          default:
            config.iceTransportPolicy = 'all';
            break;
        }

        switch (config.bundlePolicy) {
          case 'balanced':
          case 'max-compat':
          case 'max-bundle':
            break;
          default:
            config.bundlePolicy = 'balanced';
            break;
        }

        config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

        this._iceGatherers = [];
        if (config.iceCandidatePoolSize) {
          for (var i = config.iceCandidatePoolSize; i > 0; i--) {
            this._iceGatherers.push(new window.RTCIceGatherer({
              iceServers: config.iceServers,
              gatherPolicy: config.iceTransportPolicy
            }));
          }
        } else {
          config.iceCandidatePoolSize = 0;
        }

        this._config = config;

        // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
        // everything that is needed to describe a SDP m-line.
        this.transceivers = [];

        this._sdpSessionId = sdp.generateSessionId();
        this._sdpSessionVersion = 0;

        this._dtlsRole = undefined; // role for a=setup to use in answers.

        this._isClosed = false;
      };

      Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
        configurable: true,
        get: function() {
          return this._localDescription;
        }
      });
      Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
        configurable: true,
        get: function() {
          return this._remoteDescription;
        }
      });

      // set up event handlers on prototype
      RTCPeerConnection.prototype.onicecandidate = null;
      RTCPeerConnection.prototype.onaddstream = null;
      RTCPeerConnection.prototype.ontrack = null;
      RTCPeerConnection.prototype.onremovestream = null;
      RTCPeerConnection.prototype.onsignalingstatechange = null;
      RTCPeerConnection.prototype.oniceconnectionstatechange = null;
      RTCPeerConnection.prototype.onconnectionstatechange = null;
      RTCPeerConnection.prototype.onicegatheringstatechange = null;
      RTCPeerConnection.prototype.onnegotiationneeded = null;
      RTCPeerConnection.prototype.ondatachannel = null;

      RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
        if (this._isClosed) {
          return;
        }
        this.dispatchEvent(event);
        if (typeof this['on' + name] === 'function') {
          this['on' + name](event);
        }
      };

      RTCPeerConnection.prototype._emitGatheringStateChange = function() {
        var event = new Event('icegatheringstatechange');
        this._dispatchEvent('icegatheringstatechange', event);
      };

      RTCPeerConnection.prototype.getConfiguration = function() {
        return this._config;
      };

      RTCPeerConnection.prototype.getLocalStreams = function() {
        return this.localStreams;
      };

      RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this.remoteStreams;
      };

      // internal helper to create a transceiver object.
      // (which is not yet the same as the WebRTC 1.0 transceiver)
      RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
        var hasBundleTransport = this.transceivers.length > 0;
        var transceiver = {
          track: null,
          iceGatherer: null,
          iceTransport: null,
          dtlsTransport: null,
          localCapabilities: null,
          remoteCapabilities: null,
          rtpSender: null,
          rtpReceiver: null,
          kind: kind,
          mid: null,
          sendEncodingParameters: null,
          recvEncodingParameters: null,
          stream: null,
          associatedRemoteMediaStreams: [],
          wantReceive: true
        };
        if (this.usingBundle && hasBundleTransport) {
          transceiver.iceTransport = this.transceivers[0].iceTransport;
          transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
        } else {
          var transports = this._createIceAndDtlsTransports();
          transceiver.iceTransport = transports.iceTransport;
          transceiver.dtlsTransport = transports.dtlsTransport;
        }
        if (!doNotAdd) {
          this.transceivers.push(transceiver);
        }
        return transceiver;
      };

      RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (this._isClosed) {
          throw makeError('InvalidStateError',
              'Attempted to call addTrack on a closed peerconnection.');
        }

        var alreadyExists = this.transceivers.find(function(s) {
          return s.track === track;
        });

        if (alreadyExists) {
          throw makeError('InvalidAccessError', 'Track already exists.');
        }

        var transceiver;
        for (var i = 0; i < this.transceivers.length; i++) {
          if (!this.transceivers[i].track &&
              this.transceivers[i].kind === track.kind) {
            transceiver = this.transceivers[i];
          }
        }
        if (!transceiver) {
          transceiver = this._createTransceiver(track.kind);
        }

        this._maybeFireNegotiationNeeded();

        if (this.localStreams.indexOf(stream) === -1) {
          this.localStreams.push(stream);
        }

        transceiver.track = track;
        transceiver.stream = stream;
        transceiver.rtpSender = new window.RTCRtpSender(track,
            transceiver.dtlsTransport);
        return transceiver.rtpSender;
      };

      RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        if (edgeVersion >= 15025) {
          stream.getTracks().forEach(function(track) {
            pc.addTrack(track, stream);
          });
        } else {
          // Clone is necessary for local demos mostly, attaching directly
          // to two different senders does not work (build 10547).
          // Fixed in 15025 (or earlier)
          var clonedStream = stream.clone();
          stream.getTracks().forEach(function(track, idx) {
            var clonedTrack = clonedStream.getTracks()[idx];
            track.addEventListener('enabled', function(event) {
              clonedTrack.enabled = event.enabled;
            });
          });
          clonedStream.getTracks().forEach(function(track) {
            pc.addTrack(track, clonedStream);
          });
        }
      };

      RTCPeerConnection.prototype.removeTrack = function(sender) {
        if (this._isClosed) {
          throw makeError('InvalidStateError',
              'Attempted to call removeTrack on a closed peerconnection.');
        }

        if (!(sender instanceof window.RTCRtpSender)) {
          throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
              'does not implement interface RTCRtpSender.');
        }

        var transceiver = this.transceivers.find(function(t) {
          return t.rtpSender === sender;
        });

        if (!transceiver) {
          throw makeError('InvalidAccessError',
              'Sender was not created by this connection.');
        }
        var stream = transceiver.stream;

        transceiver.rtpSender.stop();
        transceiver.rtpSender = null;
        transceiver.track = null;
        transceiver.stream = null;

        // remove the stream from the set of local streams
        var localStreams = this.transceivers.map(function(t) {
          return t.stream;
        });
        if (localStreams.indexOf(stream) === -1 &&
            this.localStreams.indexOf(stream) > -1) {
          this.localStreams.splice(this.localStreams.indexOf(stream), 1);
        }

        this._maybeFireNegotiationNeeded();
      };

      RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        stream.getTracks().forEach(function(track) {
          var sender = pc.getSenders().find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc.removeTrack(sender);
          }
        });
      };

      RTCPeerConnection.prototype.getSenders = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpSender;
        })
        .map(function(transceiver) {
          return transceiver.rtpSender;
        });
      };

      RTCPeerConnection.prototype.getReceivers = function() {
        return this.transceivers.filter(function(transceiver) {
          return !!transceiver.rtpReceiver;
        })
        .map(function(transceiver) {
          return transceiver.rtpReceiver;
        });
      };


      RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
          usingBundle) {
        var pc = this;
        if (usingBundle && sdpMLineIndex > 0) {
          return this.transceivers[0].iceGatherer;
        } else if (this._iceGatherers.length) {
          return this._iceGatherers.shift();
        }
        var iceGatherer = new window.RTCIceGatherer({
          iceServers: this._config.iceServers,
          gatherPolicy: this._config.iceTransportPolicy
        });
        Object.defineProperty(iceGatherer, 'state',
            {value: 'new', writable: true}
        );

        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
        this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
          var end = !event.candidate || Object.keys(event.candidate).length === 0;
          // polyfill since RTCIceGatherer.state is not implemented in
          // Edge 10547 yet.
          iceGatherer.state = end ? 'completed' : 'gathering';
          if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
            pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
          }
        };
        iceGatherer.addEventListener('localcandidate',
          this.transceivers[sdpMLineIndex].bufferCandidates);
        return iceGatherer;
      };

      // start gathering from an RTCIceGatherer.
      RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
        var pc = this;
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer.onlocalcandidate) {
          return;
        }
        var bufferedCandidateEvents =
          this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
        this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
        iceGatherer.removeEventListener('localcandidate',
          this.transceivers[sdpMLineIndex].bufferCandidates);
        iceGatherer.onlocalcandidate = function(evt) {
          if (pc.usingBundle && sdpMLineIndex > 0) {
            // if we know that we use bundle we can drop candidates with
            // ѕdpMLineIndex > 0. If we don't do this then our state gets
            // confused since we dispose the extra ice gatherer.
            return;
          }
          var event = new Event('icecandidate');
          event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

          var cand = evt.candidate;
          // Edge emits an empty object for RTCIceCandidateComplete‥
          var end = !cand || Object.keys(cand).length === 0;
          if (end) {
            // polyfill since RTCIceGatherer.state is not implemented in
            // Edge 10547 yet.
            if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
              iceGatherer.state = 'completed';
            }
          } else {
            if (iceGatherer.state === 'new') {
              iceGatherer.state = 'gathering';
            }
            // RTCIceCandidate doesn't have a component, needs to be added
            cand.component = 1;
            // also the usernameFragment. TODO: update SDP to take both variants.
            cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

            var serializedCandidate = sdp.writeCandidate(cand);
            event.candidate = Object.assign(event.candidate,
                sdp.parseCandidate(serializedCandidate));

            event.candidate.candidate = serializedCandidate;
            event.candidate.toJSON = function() {
              return {
                candidate: event.candidate.candidate,
                sdpMid: event.candidate.sdpMid,
                sdpMLineIndex: event.candidate.sdpMLineIndex,
                usernameFragment: event.candidate.usernameFragment
              };
            };
          }

          // update local description.
          var sections = sdp.getMediaSections(pc._localDescription.sdp);
          if (!end) {
            sections[event.candidate.sdpMLineIndex] +=
                'a=' + event.candidate.candidate + '\r\n';
          } else {
            sections[event.candidate.sdpMLineIndex] +=
                'a=end-of-candidates\r\n';
          }
          pc._localDescription.sdp =
              sdp.getDescription(pc._localDescription.sdp) +
              sections.join('');
          var complete = pc.transceivers.every(function(transceiver) {
            return transceiver.iceGatherer &&
                transceiver.iceGatherer.state === 'completed';
          });

          if (pc.iceGatheringState !== 'gathering') {
            pc.iceGatheringState = 'gathering';
            pc._emitGatheringStateChange();
          }

          // Emit candidate. Also emit null candidate when all gatherers are
          // complete.
          if (!end) {
            pc._dispatchEvent('icecandidate', event);
          }
          if (complete) {
            pc._dispatchEvent('icecandidate', new Event('icecandidate'));
            pc.iceGatheringState = 'complete';
            pc._emitGatheringStateChange();
          }
        };

        // emit already gathered candidates.
        window.setTimeout(function() {
          bufferedCandidateEvents.forEach(function(e) {
            iceGatherer.onlocalcandidate(e);
          });
        }, 0);
      };

      // Create ICE transport and DTLS transport.
      RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
        var pc = this;
        var iceTransport = new window.RTCIceTransport(null);
        iceTransport.onicestatechange = function() {
          pc._updateIceConnectionState();
          pc._updateConnectionState();
        };

        var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
        dtlsTransport.ondtlsstatechange = function() {
          pc._updateConnectionState();
        };
        dtlsTransport.onerror = function() {
          // onerror does not set state to failed by itself.
          Object.defineProperty(dtlsTransport, 'state',
              {value: 'failed', writable: true});
          pc._updateConnectionState();
        };

        return {
          iceTransport: iceTransport,
          dtlsTransport: dtlsTransport
        };
      };

      // Destroy ICE gatherer, ICE transport and DTLS transport.
      // Without triggering the callbacks.
      RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
          sdpMLineIndex) {
        var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
        if (iceGatherer) {
          delete iceGatherer.onlocalcandidate;
          delete this.transceivers[sdpMLineIndex].iceGatherer;
        }
        var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
        if (iceTransport) {
          delete iceTransport.onicestatechange;
          delete this.transceivers[sdpMLineIndex].iceTransport;
        }
        var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
        if (dtlsTransport) {
          delete dtlsTransport.ondtlsstatechange;
          delete dtlsTransport.onerror;
          delete this.transceivers[sdpMLineIndex].dtlsTransport;
        }
      };

      // Start the RTP Sender and Receiver for a transceiver.
      RTCPeerConnection.prototype._transceive = function(transceiver,
          send, recv) {
        var params = getCommonCapabilities(transceiver.localCapabilities,
            transceiver.remoteCapabilities);
        if (send && transceiver.rtpSender) {
          params.encodings = transceiver.sendEncodingParameters;
          params.rtcp = {
            cname: sdp.localCName,
            compound: transceiver.rtcpParameters.compound
          };
          if (transceiver.recvEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
          }
          transceiver.rtpSender.send(params);
        }
        if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
          // remove RTX field in Edge 14942
          if (transceiver.kind === 'video'
              && transceiver.recvEncodingParameters
              && edgeVersion < 15019) {
            transceiver.recvEncodingParameters.forEach(function(p) {
              delete p.rtx;
            });
          }
          if (transceiver.recvEncodingParameters.length) {
            params.encodings = transceiver.recvEncodingParameters;
          } else {
            params.encodings = [{}];
          }
          params.rtcp = {
            compound: transceiver.rtcpParameters.compound
          };
          if (transceiver.rtcpParameters.cname) {
            params.rtcp.cname = transceiver.rtcpParameters.cname;
          }
          if (transceiver.sendEncodingParameters.length) {
            params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
          }
          transceiver.rtpReceiver.receive(params);
        }
      };

      RTCPeerConnection.prototype.setLocalDescription = function(description) {
        var pc = this;

        // Note: pranswer is not supported.
        if (['offer', 'answer'].indexOf(description.type) === -1) {
          return Promise.reject(makeError('TypeError',
              'Unsupported type "' + description.type + '"'));
        }

        if (!isActionAllowedInSignalingState('setLocalDescription',
            description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not set local ' + description.type +
              ' in state ' + pc.signalingState));
        }

        var sections;
        var sessionpart;
        if (description.type === 'offer') {
          // VERY limited support for SDP munging. Limited to:
          // * changing the order of codecs
          sections = sdp.splitSections(description.sdp);
          sessionpart = sections.shift();
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var caps = sdp.parseRtpParameters(mediaSection);
            pc.transceivers[sdpMLineIndex].localCapabilities = caps;
          });

          pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
            pc._gather(transceiver.mid, sdpMLineIndex);
          });
        } else if (description.type === 'answer') {
          sections = sdp.splitSections(pc._remoteDescription.sdp);
          sessionpart = sections.shift();
          var isIceLite = sdp.matchPrefix(sessionpart,
              'a=ice-lite').length > 0;
          sections.forEach(function(mediaSection, sdpMLineIndex) {
            var transceiver = pc.transceivers[sdpMLineIndex];
            var iceGatherer = transceiver.iceGatherer;
            var iceTransport = transceiver.iceTransport;
            var dtlsTransport = transceiver.dtlsTransport;
            var localCapabilities = transceiver.localCapabilities;
            var remoteCapabilities = transceiver.remoteCapabilities;

            // treat bundle-only as not-rejected.
            var rejected = sdp.isRejected(mediaSection) &&
                sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

            if (!rejected && !transceiver.rejected) {
              var remoteIceParameters = sdp.getIceParameters(
                  mediaSection, sessionpart);
              var remoteDtlsParameters = sdp.getDtlsParameters(
                  mediaSection, sessionpart);
              if (isIceLite) {
                remoteDtlsParameters.role = 'server';
              }

              if (!pc.usingBundle || sdpMLineIndex === 0) {
                pc._gather(transceiver.mid, sdpMLineIndex);
                if (iceTransport.state === 'new') {
                  iceTransport.start(iceGatherer, remoteIceParameters,
                      isIceLite ? 'controlling' : 'controlled');
                }
                if (dtlsTransport.state === 'new') {
                  dtlsTransport.start(remoteDtlsParameters);
                }
              }

              // Calculate intersection of capabilities.
              var params = getCommonCapabilities(localCapabilities,
                  remoteCapabilities);

              // Start the RTCRtpSender. The RTCRtpReceiver for this
              // transceiver has already been started in setRemoteDescription.
              pc._transceive(transceiver,
                  params.codecs.length > 0,
                  false);
            }
          });
        }

        pc._localDescription = {
          type: description.type,
          sdp: description.sdp
        };
        if (description.type === 'offer') {
          pc._updateSignalingState('have-local-offer');
        } else {
          pc._updateSignalingState('stable');
        }

        return Promise.resolve();
      };

      RTCPeerConnection.prototype.setRemoteDescription = function(description) {
        var pc = this;

        // Note: pranswer is not supported.
        if (['offer', 'answer'].indexOf(description.type) === -1) {
          return Promise.reject(makeError('TypeError',
              'Unsupported type "' + description.type + '"'));
        }

        if (!isActionAllowedInSignalingState('setRemoteDescription',
            description.type, pc.signalingState) || pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not set remote ' + description.type +
              ' in state ' + pc.signalingState));
        }

        var streams = {};
        pc.remoteStreams.forEach(function(stream) {
          streams[stream.id] = stream;
        });
        var receiverList = [];
        var sections = sdp.splitSections(description.sdp);
        var sessionpart = sections.shift();
        var isIceLite = sdp.matchPrefix(sessionpart,
            'a=ice-lite').length > 0;
        var usingBundle = sdp.matchPrefix(sessionpart,
            'a=group:BUNDLE ').length > 0;
        pc.usingBundle = usingBundle;
        var iceOptions = sdp.matchPrefix(sessionpart,
            'a=ice-options:')[0];
        if (iceOptions) {
          pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
              .indexOf('trickle') >= 0;
        } else {
          pc.canTrickleIceCandidates = false;
        }

        sections.forEach(function(mediaSection, sdpMLineIndex) {
          var lines = sdp.splitLines(mediaSection);
          var kind = sdp.getKind(mediaSection);
          // treat bundle-only as not-rejected.
          var rejected = sdp.isRejected(mediaSection) &&
              sdp.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
          var protocol = lines[0].substr(2).split(' ')[2];

          var direction = sdp.getDirection(mediaSection, sessionpart);
          var remoteMsid = sdp.parseMsid(mediaSection);

          var mid = sdp.getMid(mediaSection) || sdp.generateIdentifier();

          // Reject datachannels which are not implemented yet.
          if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
              protocol === 'UDP/DTLS/SCTP'))) {
            // TODO: this is dangerous in the case where a non-rejected m-line
            //     becomes rejected.
            pc.transceivers[sdpMLineIndex] = {
              mid: mid,
              kind: kind,
              protocol: protocol,
              rejected: true
            };
            return;
          }

          if (!rejected && pc.transceivers[sdpMLineIndex] &&
              pc.transceivers[sdpMLineIndex].rejected) {
            // recycle a rejected transceiver.
            pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
          }

          var transceiver;
          var iceGatherer;
          var iceTransport;
          var dtlsTransport;
          var rtpReceiver;
          var sendEncodingParameters;
          var recvEncodingParameters;
          var localCapabilities;

          var track;
          // FIXME: ensure the mediaSection has rtcp-mux set.
          var remoteCapabilities = sdp.parseRtpParameters(mediaSection);
          var remoteIceParameters;
          var remoteDtlsParameters;
          if (!rejected) {
            remoteIceParameters = sdp.getIceParameters(mediaSection,
                sessionpart);
            remoteDtlsParameters = sdp.getDtlsParameters(mediaSection,
                sessionpart);
            remoteDtlsParameters.role = 'client';
          }
          recvEncodingParameters =
              sdp.parseRtpEncodingParameters(mediaSection);

          var rtcpParameters = sdp.parseRtcpParameters(mediaSection);

          var isComplete = sdp.matchPrefix(mediaSection,
              'a=end-of-candidates', sessionpart).length > 0;
          var cands = sdp.matchPrefix(mediaSection, 'a=candidate:')
              .map(function(cand) {
                return sdp.parseCandidate(cand);
              })
              .filter(function(cand) {
                return cand.component === 1;
              });

          // Check if we can use BUNDLE and dispose transports.
          if ((description.type === 'offer' || description.type === 'answer') &&
              !rejected && usingBundle && sdpMLineIndex > 0 &&
              pc.transceivers[sdpMLineIndex]) {
            pc._disposeIceAndDtlsTransports(sdpMLineIndex);
            pc.transceivers[sdpMLineIndex].iceGatherer =
                pc.transceivers[0].iceGatherer;
            pc.transceivers[sdpMLineIndex].iceTransport =
                pc.transceivers[0].iceTransport;
            pc.transceivers[sdpMLineIndex].dtlsTransport =
                pc.transceivers[0].dtlsTransport;
            if (pc.transceivers[sdpMLineIndex].rtpSender) {
              pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
                  pc.transceivers[0].dtlsTransport);
            }
            if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
              pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
                  pc.transceivers[0].dtlsTransport);
            }
          }
          if (description.type === 'offer' && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex] ||
                pc._createTransceiver(kind);
            transceiver.mid = mid;

            if (!transceiver.iceGatherer) {
              transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                  usingBundle);
            }

            if (cands.length && transceiver.iceTransport.state === 'new') {
              if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
                transceiver.iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }

            localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

            // filter RTX until additional stuff needed for RTX is implemented
            // in adapter.js
            if (edgeVersion < 15019) {
              localCapabilities.codecs = localCapabilities.codecs.filter(
                  function(codec) {
                    return codec.name !== 'rtx';
                  });
            }

            sendEncodingParameters = transceiver.sendEncodingParameters || [{
              ssrc: (2 * sdpMLineIndex + 2) * 1001
            }];

            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
            var isNewTrack = false;
            if (direction === 'sendrecv' || direction === 'sendonly') {
              isNewTrack = !transceiver.rtpReceiver;
              rtpReceiver = transceiver.rtpReceiver ||
                  new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

              if (isNewTrack) {
                var stream;
                track = rtpReceiver.track;
                // FIXME: does not work with Plan B.
                if (remoteMsid && remoteMsid.stream === '-') ; else if (remoteMsid) {
                  if (!streams[remoteMsid.stream]) {
                    streams[remoteMsid.stream] = new window.MediaStream();
                    Object.defineProperty(streams[remoteMsid.stream], 'id', {
                      get: function() {
                        return remoteMsid.stream;
                      }
                    });
                  }
                  Object.defineProperty(track, 'id', {
                    get: function() {
                      return remoteMsid.track;
                    }
                  });
                  stream = streams[remoteMsid.stream];
                } else {
                  if (!streams.default) {
                    streams.default = new window.MediaStream();
                  }
                  stream = streams.default;
                }
                if (stream) {
                  addTrackToStreamAndFireEvent(track, stream);
                  transceiver.associatedRemoteMediaStreams.push(stream);
                }
                receiverList.push([track, rtpReceiver, stream]);
              }
            } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
              transceiver.associatedRemoteMediaStreams.forEach(function(s) {
                var nativeTrack = s.getTracks().find(function(t) {
                  return t.id === transceiver.rtpReceiver.track.id;
                });
                if (nativeTrack) {
                  removeTrackFromStreamAndFireEvent(nativeTrack, s);
                }
              });
              transceiver.associatedRemoteMediaStreams = [];
            }

            transceiver.localCapabilities = localCapabilities;
            transceiver.remoteCapabilities = remoteCapabilities;
            transceiver.rtpReceiver = rtpReceiver;
            transceiver.rtcpParameters = rtcpParameters;
            transceiver.sendEncodingParameters = sendEncodingParameters;
            transceiver.recvEncodingParameters = recvEncodingParameters;

            // Start the RTCRtpReceiver now. The RTPSender is started in
            // setLocalDescription.
            pc._transceive(pc.transceivers[sdpMLineIndex],
                false,
                isNewTrack);
          } else if (description.type === 'answer' && !rejected) {
            transceiver = pc.transceivers[sdpMLineIndex];
            iceGatherer = transceiver.iceGatherer;
            iceTransport = transceiver.iceTransport;
            dtlsTransport = transceiver.dtlsTransport;
            rtpReceiver = transceiver.rtpReceiver;
            sendEncodingParameters = transceiver.sendEncodingParameters;
            localCapabilities = transceiver.localCapabilities;

            pc.transceivers[sdpMLineIndex].recvEncodingParameters =
                recvEncodingParameters;
            pc.transceivers[sdpMLineIndex].remoteCapabilities =
                remoteCapabilities;
            pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

            if (cands.length && iceTransport.state === 'new') {
              if ((isIceLite || isComplete) &&
                  (!usingBundle || sdpMLineIndex === 0)) {
                iceTransport.setRemoteCandidates(cands);
              } else {
                cands.forEach(function(candidate) {
                  maybeAddCandidate(transceiver.iceTransport, candidate);
                });
              }
            }

            if (!usingBundle || sdpMLineIndex === 0) {
              if (iceTransport.state === 'new') {
                iceTransport.start(iceGatherer, remoteIceParameters,
                    'controlling');
              }
              if (dtlsTransport.state === 'new') {
                dtlsTransport.start(remoteDtlsParameters);
              }
            }

            // If the offer contained RTX but the answer did not,
            // remove RTX from sendEncodingParameters.
            var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities);

            var hasRtx = commonCapabilities.codecs.filter(function(c) {
              return c.name.toLowerCase() === 'rtx';
            }).length;
            if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
              delete transceiver.sendEncodingParameters[0].rtx;
            }

            pc._transceive(transceiver,
                direction === 'sendrecv' || direction === 'recvonly',
                direction === 'sendrecv' || direction === 'sendonly');

            // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
            if (rtpReceiver &&
                (direction === 'sendrecv' || direction === 'sendonly')) {
              track = rtpReceiver.track;
              if (remoteMsid) {
                if (!streams[remoteMsid.stream]) {
                  streams[remoteMsid.stream] = new window.MediaStream();
                }
                addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
                receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
              } else {
                if (!streams.default) {
                  streams.default = new window.MediaStream();
                }
                addTrackToStreamAndFireEvent(track, streams.default);
                receiverList.push([track, rtpReceiver, streams.default]);
              }
            } else {
              // FIXME: actually the receiver should be created later.
              delete transceiver.rtpReceiver;
            }
          }
        });

        if (pc._dtlsRole === undefined) {
          pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
        }

        pc._remoteDescription = {
          type: description.type,
          sdp: description.sdp
        };
        if (description.type === 'offer') {
          pc._updateSignalingState('have-remote-offer');
        } else {
          pc._updateSignalingState('stable');
        }
        Object.keys(streams).forEach(function(sid) {
          var stream = streams[sid];
          if (stream.getTracks().length) {
            if (pc.remoteStreams.indexOf(stream) === -1) {
              pc.remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              window.setTimeout(function() {
                pc._dispatchEvent('addstream', event);
              });
            }

            receiverList.forEach(function(item) {
              var track = item[0];
              var receiver = item[1];
              if (stream.id !== item[2].id) {
                return;
              }
              fireAddTrack(pc, track, receiver, [stream]);
            });
          }
        });
        receiverList.forEach(function(item) {
          if (item[2]) {
            return;
          }
          fireAddTrack(pc, item[0], item[1], []);
        });

        // check whether addIceCandidate({}) was called within four seconds after
        // setRemoteDescription.
        window.setTimeout(function() {
          if (!(pc && pc.transceivers)) {
            return;
          }
          pc.transceivers.forEach(function(transceiver) {
            if (transceiver.iceTransport &&
                transceiver.iceTransport.state === 'new' &&
                transceiver.iceTransport.getRemoteCandidates().length > 0) {
              console.warn('Timeout for addRemoteCandidate. Consider sending ' +
                  'an end-of-candidates notification');
              transceiver.iceTransport.addRemoteCandidate({});
            }
          });
        }, 4000);

        return Promise.resolve();
      };

      RTCPeerConnection.prototype.close = function() {
        this.transceivers.forEach(function(transceiver) {
          /* not yet
          if (transceiver.iceGatherer) {
            transceiver.iceGatherer.close();
          }
          */
          if (transceiver.iceTransport) {
            transceiver.iceTransport.stop();
          }
          if (transceiver.dtlsTransport) {
            transceiver.dtlsTransport.stop();
          }
          if (transceiver.rtpSender) {
            transceiver.rtpSender.stop();
          }
          if (transceiver.rtpReceiver) {
            transceiver.rtpReceiver.stop();
          }
        });
        // FIXME: clean up tracks, local streams, remote streams, etc
        this._isClosed = true;
        this._updateSignalingState('closed');
      };

      // Update the signaling state.
      RTCPeerConnection.prototype._updateSignalingState = function(newState) {
        this.signalingState = newState;
        var event = new Event('signalingstatechange');
        this._dispatchEvent('signalingstatechange', event);
      };

      // Determine whether to fire the negotiationneeded event.
      RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
        var pc = this;
        if (this.signalingState !== 'stable' || this.needNegotiation === true) {
          return;
        }
        this.needNegotiation = true;
        window.setTimeout(function() {
          if (pc.needNegotiation) {
            pc.needNegotiation = false;
            var event = new Event('negotiationneeded');
            pc._dispatchEvent('negotiationneeded', event);
          }
        }, 0);
      };

      // Update the ice connection state.
      RTCPeerConnection.prototype._updateIceConnectionState = function() {
        var newState;
        var states = {
          'new': 0,
          closed: 0,
          checking: 0,
          connected: 0,
          completed: 0,
          disconnected: 0,
          failed: 0
        };
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
          }
        });

        newState = 'new';
        if (states.failed > 0) {
          newState = 'failed';
        } else if (states.checking > 0) {
          newState = 'checking';
        } else if (states.disconnected > 0) {
          newState = 'disconnected';
        } else if (states.new > 0) {
          newState = 'new';
        } else if (states.connected > 0) {
          newState = 'connected';
        } else if (states.completed > 0) {
          newState = 'completed';
        }

        if (newState !== this.iceConnectionState) {
          this.iceConnectionState = newState;
          var event = new Event('iceconnectionstatechange');
          this._dispatchEvent('iceconnectionstatechange', event);
        }
      };

      // Update the connection state.
      RTCPeerConnection.prototype._updateConnectionState = function() {
        var newState;
        var states = {
          'new': 0,
          closed: 0,
          connecting: 0,
          connected: 0,
          completed: 0,
          disconnected: 0,
          failed: 0
        };
        this.transceivers.forEach(function(transceiver) {
          if (transceiver.iceTransport && transceiver.dtlsTransport &&
              !transceiver.rejected) {
            states[transceiver.iceTransport.state]++;
            states[transceiver.dtlsTransport.state]++;
          }
        });
        // ICETransport.completed and connected are the same for this purpose.
        states.connected += states.completed;

        newState = 'new';
        if (states.failed > 0) {
          newState = 'failed';
        } else if (states.connecting > 0) {
          newState = 'connecting';
        } else if (states.disconnected > 0) {
          newState = 'disconnected';
        } else if (states.new > 0) {
          newState = 'new';
        } else if (states.connected > 0) {
          newState = 'connected';
        }

        if (newState !== this.connectionState) {
          this.connectionState = newState;
          var event = new Event('connectionstatechange');
          this._dispatchEvent('connectionstatechange', event);
        }
      };

      RTCPeerConnection.prototype.createOffer = function() {
        var pc = this;

        if (pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createOffer after close'));
        }

        var numAudioTracks = pc.transceivers.filter(function(t) {
          return t.kind === 'audio';
        }).length;
        var numVideoTracks = pc.transceivers.filter(function(t) {
          return t.kind === 'video';
        }).length;

        // Determine number of audio and video tracks we need to send/recv.
        var offerOptions = arguments[0];
        if (offerOptions) {
          // Reject Chrome legacy constraints.
          if (offerOptions.mandatory || offerOptions.optional) {
            throw new TypeError(
                'Legacy mandatory/optional constraints not supported.');
          }
          if (offerOptions.offerToReceiveAudio !== undefined) {
            if (offerOptions.offerToReceiveAudio === true) {
              numAudioTracks = 1;
            } else if (offerOptions.offerToReceiveAudio === false) {
              numAudioTracks = 0;
            } else {
              numAudioTracks = offerOptions.offerToReceiveAudio;
            }
          }
          if (offerOptions.offerToReceiveVideo !== undefined) {
            if (offerOptions.offerToReceiveVideo === true) {
              numVideoTracks = 1;
            } else if (offerOptions.offerToReceiveVideo === false) {
              numVideoTracks = 0;
            } else {
              numVideoTracks = offerOptions.offerToReceiveVideo;
            }
          }
        }

        pc.transceivers.forEach(function(transceiver) {
          if (transceiver.kind === 'audio') {
            numAudioTracks--;
            if (numAudioTracks < 0) {
              transceiver.wantReceive = false;
            }
          } else if (transceiver.kind === 'video') {
            numVideoTracks--;
            if (numVideoTracks < 0) {
              transceiver.wantReceive = false;
            }
          }
        });

        // Create M-lines for recvonly streams.
        while (numAudioTracks > 0 || numVideoTracks > 0) {
          if (numAudioTracks > 0) {
            pc._createTransceiver('audio');
            numAudioTracks--;
          }
          if (numVideoTracks > 0) {
            pc._createTransceiver('video');
            numVideoTracks--;
          }
        }

        var sdp$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
            pc._sdpSessionVersion++);
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          // For each track, create an ice gatherer, ice transport,
          // dtls transport, potentially rtpsender and rtpreceiver.
          var track = transceiver.track;
          var kind = transceiver.kind;
          var mid = transceiver.mid || sdp.generateIdentifier();
          transceiver.mid = mid;

          if (!transceiver.iceGatherer) {
            transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
                pc.usingBundle);
          }

          var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
          // filter RTX until additional stuff needed for RTX is implemented
          // in adapter.js
          if (edgeVersion < 15019) {
            localCapabilities.codecs = localCapabilities.codecs.filter(
                function(codec) {
                  return codec.name !== 'rtx';
                });
          }
          localCapabilities.codecs.forEach(function(codec) {
            // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
            // by adding level-asymmetry-allowed=1
            if (codec.name === 'H264' &&
                codec.parameters['level-asymmetry-allowed'] === undefined) {
              codec.parameters['level-asymmetry-allowed'] = '1';
            }

            // for subsequent offers, we might have to re-use the payload
            // type of the last offer.
            if (transceiver.remoteCapabilities &&
                transceiver.remoteCapabilities.codecs) {
              transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
                if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                    codec.clockRate === remoteCodec.clockRate) {
                  codec.preferredPayloadType = remoteCodec.payloadType;
                }
              });
            }
          });
          localCapabilities.headerExtensions.forEach(function(hdrExt) {
            var remoteExtensions = transceiver.remoteCapabilities &&
                transceiver.remoteCapabilities.headerExtensions || [];
            remoteExtensions.forEach(function(rHdrExt) {
              if (hdrExt.uri === rHdrExt.uri) {
                hdrExt.id = rHdrExt.id;
              }
            });
          });

          // generate an ssrc now, to be used later in rtpSender.send
          var sendEncodingParameters = transceiver.sendEncodingParameters || [{
            ssrc: (2 * sdpMLineIndex + 1) * 1001
          }];
          if (track) {
            // add RTX
            if (edgeVersion >= 15019 && kind === 'video' &&
                !sendEncodingParameters[0].rtx) {
              sendEncodingParameters[0].rtx = {
                ssrc: sendEncodingParameters[0].ssrc + 1
              };
            }
          }

          if (transceiver.wantReceive) {
            transceiver.rtpReceiver = new window.RTCRtpReceiver(
                transceiver.dtlsTransport, kind);
          }

          transceiver.localCapabilities = localCapabilities;
          transceiver.sendEncodingParameters = sendEncodingParameters;
        });

        // always offer BUNDLE and dispose on return if not supported.
        if (pc._config.bundlePolicy !== 'max-compat') {
          sdp$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(' ') + '\r\n';
        }
        sdp$1 += 'a=ice-options:trickle\r\n';

        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          sdp$1 += writeMediaSection(transceiver, transceiver.localCapabilities,
              'offer', transceiver.stream, pc._dtlsRole);
          sdp$1 += 'a=rtcp-rsize\r\n';

          if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
              (sdpMLineIndex === 0 || !pc.usingBundle)) {
            transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
              cand.component = 1;
              sdp$1 += 'a=' + sdp.writeCandidate(cand) + '\r\n';
            });

            if (transceiver.iceGatherer.state === 'completed') {
              sdp$1 += 'a=end-of-candidates\r\n';
            }
          }
        });

        var desc = new window.RTCSessionDescription({
          type: 'offer',
          sdp: sdp$1
        });
        return Promise.resolve(desc);
      };

      RTCPeerConnection.prototype.createAnswer = function() {
        var pc = this;

        if (pc._isClosed) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createAnswer after close'));
        }

        if (!(pc.signalingState === 'have-remote-offer' ||
            pc.signalingState === 'have-local-pranswer')) {
          return Promise.reject(makeError('InvalidStateError',
              'Can not call createAnswer in signalingState ' + pc.signalingState));
        }

        var sdp$1 = sdp.writeSessionBoilerplate(pc._sdpSessionId,
            pc._sdpSessionVersion++);
        if (pc.usingBundle) {
          sdp$1 += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
            return t.mid;
          }).join(' ') + '\r\n';
        }
        sdp$1 += 'a=ice-options:trickle\r\n';

        var mediaSectionsInOffer = sdp.getMediaSections(
            pc._remoteDescription.sdp).length;
        pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
          if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
            return;
          }
          if (transceiver.rejected) {
            if (transceiver.kind === 'application') {
              if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
                sdp$1 += 'm=application 0 DTLS/SCTP 5000\r\n';
              } else {
                sdp$1 += 'm=application 0 ' + transceiver.protocol +
                    ' webrtc-datachannel\r\n';
              }
            } else if (transceiver.kind === 'audio') {
              sdp$1 += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
                  'a=rtpmap:0 PCMU/8000\r\n';
            } else if (transceiver.kind === 'video') {
              sdp$1 += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
                  'a=rtpmap:120 VP8/90000\r\n';
            }
            sdp$1 += 'c=IN IP4 0.0.0.0\r\n' +
                'a=inactive\r\n' +
                'a=mid:' + transceiver.mid + '\r\n';
            return;
          }

          // FIXME: look at direction.
          if (transceiver.stream) {
            var localTrack;
            if (transceiver.kind === 'audio') {
              localTrack = transceiver.stream.getAudioTracks()[0];
            } else if (transceiver.kind === 'video') {
              localTrack = transceiver.stream.getVideoTracks()[0];
            }
            if (localTrack) {
              // add RTX
              if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
                  !transceiver.sendEncodingParameters[0].rtx) {
                transceiver.sendEncodingParameters[0].rtx = {
                  ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
                };
              }
            }
          }

          // Calculate intersection of capabilities.
          var commonCapabilities = getCommonCapabilities(
              transceiver.localCapabilities,
              transceiver.remoteCapabilities);

          var hasRtx = commonCapabilities.codecs.filter(function(c) {
            return c.name.toLowerCase() === 'rtx';
          }).length;
          if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
            delete transceiver.sendEncodingParameters[0].rtx;
          }

          sdp$1 += writeMediaSection(transceiver, commonCapabilities,
              'answer', transceiver.stream, pc._dtlsRole);
          if (transceiver.rtcpParameters &&
              transceiver.rtcpParameters.reducedSize) {
            sdp$1 += 'a=rtcp-rsize\r\n';
          }
        });

        var desc = new window.RTCSessionDescription({
          type: 'answer',
          sdp: sdp$1
        });
        return Promise.resolve(desc);
      };

      RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
        var pc = this;
        var sections;
        if (candidate && !(candidate.sdpMLineIndex !== undefined ||
            candidate.sdpMid)) {
          return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
        }

        // TODO: needs to go into ops queue.
        return new Promise(function(resolve, reject) {
          if (!pc._remoteDescription) {
            return reject(makeError('InvalidStateError',
                'Can not add ICE candidate without a remote description'));
          } else if (!candidate || candidate.candidate === '') {
            for (var j = 0; j < pc.transceivers.length; j++) {
              if (pc.transceivers[j].rejected) {
                continue;
              }
              pc.transceivers[j].iceTransport.addRemoteCandidate({});
              sections = sdp.getMediaSections(pc._remoteDescription.sdp);
              sections[j] += 'a=end-of-candidates\r\n';
              pc._remoteDescription.sdp =
                  sdp.getDescription(pc._remoteDescription.sdp) +
                  sections.join('');
              if (pc.usingBundle) {
                break;
              }
            }
          } else {
            var sdpMLineIndex = candidate.sdpMLineIndex;
            if (candidate.sdpMid) {
              for (var i = 0; i < pc.transceivers.length; i++) {
                if (pc.transceivers[i].mid === candidate.sdpMid) {
                  sdpMLineIndex = i;
                  break;
                }
              }
            }
            var transceiver = pc.transceivers[sdpMLineIndex];
            if (transceiver) {
              if (transceiver.rejected) {
                return resolve();
              }
              var cand = Object.keys(candidate.candidate).length > 0 ?
                  sdp.parseCandidate(candidate.candidate) : {};
              // Ignore Chrome's invalid candidates since Edge does not like them.
              if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
                return resolve();
              }
              // Ignore RTCP candidates, we assume RTCP-MUX.
              if (cand.component && cand.component !== 1) {
                return resolve();
              }
              // when using bundle, avoid adding candidates to the wrong
              // ice transport. And avoid adding candidates added in the SDP.
              if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
                  transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
                if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
                  return reject(makeError('OperationError',
                      'Can not add ICE candidate'));
                }
              }

              // update the remoteDescription.
              var candidateString = candidate.candidate.trim();
              if (candidateString.indexOf('a=') === 0) {
                candidateString = candidateString.substr(2);
              }
              sections = sdp.getMediaSections(pc._remoteDescription.sdp);
              sections[sdpMLineIndex] += 'a=' +
                  (cand.type ? candidateString : 'end-of-candidates')
                  + '\r\n';
              pc._remoteDescription.sdp =
                  sdp.getDescription(pc._remoteDescription.sdp) +
                  sections.join('');
            } else {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }
          resolve();
        });
      };

      RTCPeerConnection.prototype.getStats = function(selector) {
        if (selector && selector instanceof window.MediaStreamTrack) {
          var senderOrReceiver = null;
          this.transceivers.forEach(function(transceiver) {
            if (transceiver.rtpSender &&
                transceiver.rtpSender.track === selector) {
              senderOrReceiver = transceiver.rtpSender;
            } else if (transceiver.rtpReceiver &&
                transceiver.rtpReceiver.track === selector) {
              senderOrReceiver = transceiver.rtpReceiver;
            }
          });
          if (!senderOrReceiver) {
            throw makeError('InvalidAccessError', 'Invalid selector.');
          }
          return senderOrReceiver.getStats();
        }

        var promises = [];
        this.transceivers.forEach(function(transceiver) {
          ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
              'dtlsTransport'].forEach(function(method) {
                if (transceiver[method]) {
                  promises.push(transceiver[method].getStats());
                }
              });
        });
        return Promise.all(promises).then(function(allStats) {
          var results = new Map();
          allStats.forEach(function(stats) {
            stats.forEach(function(stat) {
              results.set(stat.id, stat);
            });
          });
          return results;
        });
      };

      // fix low-level stat names and return Map instead of object.
      var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
        'RTCIceTransport', 'RTCDtlsTransport'];
      ortcObjects.forEach(function(ortcObjectName) {
        var obj = window[ortcObjectName];
        if (obj && obj.prototype && obj.prototype.getStats) {
          var nativeGetstats = obj.prototype.getStats;
          obj.prototype.getStats = function() {
            return nativeGetstats.apply(this)
            .then(function(nativeStats) {
              var mapStats = new Map();
              Object.keys(nativeStats).forEach(function(id) {
                nativeStats[id].type = fixStatsType(nativeStats[id]);
                mapStats.set(id, nativeStats[id]);
              });
              return mapStats;
            });
          };
        }
      });

      // legacy callback shims. Should be moved to adapter.js some days.
      var methods = ['createOffer', 'createAnswer'];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[0] === 'function' ||
              typeof args[1] === 'function') { // legacy
            return nativeMethod.apply(this, [arguments[2]])
            .then(function(description) {
              if (typeof args[0] === 'function') {
                args[0].apply(null, [description]);
              }
            }, function(error) {
              if (typeof args[1] === 'function') {
                args[1].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });

      methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
      methods.forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === 'function' ||
              typeof args[2] === 'function') { // legacy
            return nativeMethod.apply(this, arguments)
            .then(function() {
              if (typeof args[1] === 'function') {
                args[1].apply(null);
              }
            }, function(error) {
              if (typeof args[2] === 'function') {
                args[2].apply(null, [error]);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });

      // getStats is special. It doesn't have a spec legacy method yet we support
      // getStats(something, cb) without error callbacks.
      ['getStats'].forEach(function(method) {
        var nativeMethod = RTCPeerConnection.prototype[method];
        RTCPeerConnection.prototype[method] = function() {
          var args = arguments;
          if (typeof args[1] === 'function') {
            return nativeMethod.apply(this, arguments)
            .then(function() {
              if (typeof args[1] === 'function') {
                args[1].apply(null);
              }
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });

      return RTCPeerConnection;
    };

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetUserMedia$2(window) {
      const navigator = window && window.navigator;

      const shimError_ = function(e) {
        return {
          name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
          message: e.message,
          constraint: e.constraint,
          toString() {
            return this.name;
          }
        };
      };

      // getUserMedia error shim.
      const origGetUserMedia = navigator.mediaDevices.getUserMedia.
          bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = function(c) {
        return origGetUserMedia(c).catch(e => Promise.reject(shimError_(e)));
      };
    }

    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetDisplayMedia$1(window) {
      if (!('getDisplayMedia' in window.navigator)) {
        return;
      }
      if (!(window.navigator.mediaDevices)) {
        return;
      }
      if (window.navigator.mediaDevices &&
        'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia =
        window.navigator.getDisplayMedia.bind(window.navigator);
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimPeerConnection$1(window) {
      const browserDetails = detectBrowser(window);

      if (window.RTCIceGatherer) {
        if (!window.RTCIceCandidate) {
          window.RTCIceCandidate = function RTCIceCandidate(args) {
            return args;
          };
        }
        if (!window.RTCSessionDescription) {
          window.RTCSessionDescription = function RTCSessionDescription(args) {
            return args;
          };
        }
        // this adds an additional event listener to MediaStrackTrack that signals
        // when a tracks enabled property was changed. Workaround for a bug in
        // addStream, see below. No longer required in 15025+
        if (browserDetails.version < 15025) {
          const origMSTEnabled = Object.getOwnPropertyDescriptor(
              window.MediaStreamTrack.prototype, 'enabled');
          Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
            set(value) {
              origMSTEnabled.set.call(this, value);
              const ev = new Event('enabled');
              ev.enabled = value;
              this.dispatchEvent(ev);
            }
          });
        }
      }

      // ORTC defines the DTMF sender a bit different.
      // https://github.com/w3c/ortc/issues/714
      if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
        Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
          get() {
            if (this._dtmf === undefined) {
              if (this.track.kind === 'audio') {
                this._dtmf = new window.RTCDtmfSender(this);
              } else if (this.track.kind === 'video') {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          }
        });
      }
      // Edge currently only implements the RTCDtmfSender, not the
      // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
      if (window.RTCDtmfSender && !window.RTCDTMFSender) {
        window.RTCDTMFSender = window.RTCDtmfSender;
      }

      const RTCPeerConnectionShim = rtcpeerconnection(window,
          browserDetails.version);
      window.RTCPeerConnection = function RTCPeerConnection(config) {
        if (config && config.iceServers) {
          config.iceServers = filterIceServers$1(config.iceServers,
            browserDetails.version);
          log('ICE servers after filtering:', config.iceServers);
        }
        return new RTCPeerConnectionShim(config);
      };
      window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
    }

    function shimReplaceTrack(window) {
      // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
      if (window.RTCRtpSender &&
          !('replaceTrack' in window.RTCRtpSender.prototype)) {
        window.RTCRtpSender.prototype.replaceTrack =
            window.RTCRtpSender.prototype.setTrack;
      }
    }

    var edgeShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimPeerConnection: shimPeerConnection$1,
        shimReplaceTrack: shimReplaceTrack,
        shimGetUserMedia: shimGetUserMedia$2,
        shimGetDisplayMedia: shimGetDisplayMedia$1
    });

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetUserMedia$1(window) {
      const browserDetails = detectBrowser(window);
      const navigator = window && window.navigator;
      const MediaStreamTrack = window && window.MediaStreamTrack;

      navigator.getUserMedia = function(constraints, onSuccess, onError) {
        // Replace Firefox 44+'s deprecation warning with unprefixed version.
        deprecated('navigator.getUserMedia',
            'navigator.mediaDevices.getUserMedia');
        navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
      };

      if (!(browserDetails.version > 55 &&
          'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
        const remap = function(obj, a, b) {
          if (a in obj && !(b in obj)) {
            obj[b] = obj[a];
            delete obj[a];
          }
        };

        const nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
            bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = function(c) {
          if (typeof c === 'object' && typeof c.audio === 'object') {
            c = JSON.parse(JSON.stringify(c));
            remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
            remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
          }
          return nativeGetUserMedia(c);
        };

        if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
          const nativeGetSettings = MediaStreamTrack.prototype.getSettings;
          MediaStreamTrack.prototype.getSettings = function() {
            const obj = nativeGetSettings.apply(this, arguments);
            remap(obj, 'mozAutoGainControl', 'autoGainControl');
            remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
            return obj;
          };
        }

        if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
          const nativeApplyConstraints =
            MediaStreamTrack.prototype.applyConstraints;
          MediaStreamTrack.prototype.applyConstraints = function(c) {
            if (this.kind === 'audio' && typeof c === 'object') {
              c = JSON.parse(JSON.stringify(c));
              remap(c, 'autoGainControl', 'mozAutoGainControl');
              remap(c, 'noiseSuppression', 'mozNoiseSuppression');
            }
            return nativeApplyConstraints.apply(this, [c]);
          };
        }
      }
    }

    /*
     *  Copyright (c) 2018 The adapter.js project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimGetDisplayMedia(window, preferredMediaSource) {
      if (window.navigator.mediaDevices &&
        'getDisplayMedia' in window.navigator.mediaDevices) {
        return;
      }
      if (!(window.navigator.mediaDevices)) {
        return;
      }
      window.navigator.mediaDevices.getDisplayMedia =
        function getDisplayMedia(constraints) {
          if (!(constraints && constraints.video)) {
            const err = new DOMException('getDisplayMedia without video ' +
                'constraints is undefined');
            err.name = 'NotFoundError';
            // from https://heycam.github.io/webidl/#idl-DOMException-error-names
            err.code = 8;
            return Promise.reject(err);
          }
          if (constraints.video === true) {
            constraints.video = {mediaSource: preferredMediaSource};
          } else {
            constraints.video.mediaSource = preferredMediaSource;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        };
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimOnTrack(window) {
      if (typeof window === 'object' && window.RTCTrackEvent &&
          ('receiver' in window.RTCTrackEvent.prototype) &&
          !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get() {
            return {receiver: this.receiver};
          }
        });
      }
    }

    function shimPeerConnection(window) {
      const browserDetails = detectBrowser(window);

      if (typeof window !== 'object' ||
          !(window.RTCPeerConnection || window.mozRTCPeerConnection)) {
        return; // probably media.peerconnection.enabled=false in about:config
      }
      if (!window.RTCPeerConnection && window.mozRTCPeerConnection) {
        // very basic support for old versions.
        window.RTCPeerConnection = window.mozRTCPeerConnection;
      }

      if (browserDetails.version < 53) {
        // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
        ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
            .forEach(function(method) {
              const nativeMethod = window.RTCPeerConnection.prototype[method];
              const methodObj = {[method]() {
                arguments[0] = new ((method === 'addIceCandidate') ?
                    window.RTCIceCandidate :
                    window.RTCSessionDescription)(arguments[0]);
                return nativeMethod.apply(this, arguments);
              }};
              window.RTCPeerConnection.prototype[method] = methodObj[method];
            });
      }

      // support for addIceCandidate(null or undefined)
      // as well as ignoring {sdpMid, candidate: ""}
      if (browserDetails.version < 68) {
        const nativeAddIceCandidate =
            window.RTCPeerConnection.prototype.addIceCandidate;
        window.RTCPeerConnection.prototype.addIceCandidate =
        function addIceCandidate() {
          if (!arguments[0]) {
            if (arguments[1]) {
              arguments[1].apply(null);
            }
            return Promise.resolve();
          }
          // Firefox 68+ emits and processes {candidate: "", ...}, ignore
          // in older versions.
          if (arguments[0] && arguments[0].candidate === '') {
            return Promise.resolve();
          }
          return nativeAddIceCandidate.apply(this, arguments);
        };
      }

      const modernStatsTypes = {
        inboundrtp: 'inbound-rtp',
        outboundrtp: 'outbound-rtp',
        candidatepair: 'candidate-pair',
        localcandidate: 'local-candidate',
        remotecandidate: 'remote-candidate'
      };

      const nativeGetStats = window.RTCPeerConnection.prototype.getStats;
      window.RTCPeerConnection.prototype.getStats = function getStats() {
        const [selector, onSucc, onErr] = arguments;
        return nativeGetStats.apply(this, [selector || null])
          .then(stats => {
            if (browserDetails.version < 53 && !onSucc) {
              // Shim only promise getStats with spec-hyphens in type names
              // Leave callback version alone; misc old uses of forEach before Map
              try {
                stats.forEach(stat => {
                  stat.type = modernStatsTypes[stat.type] || stat.type;
                });
              } catch (e) {
                if (e.name !== 'TypeError') {
                  throw e;
                }
                // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
                stats.forEach((stat, i) => {
                  stats.set(i, Object.assign({}, stat, {
                    type: modernStatsTypes[stat.type] || stat.type
                  }));
                });
              }
            }
            return stats;
          })
          .then(onSucc, onErr);
      };
    }

    function shimSenderGetStats(window) {
      if (!(typeof window === 'object' && window.RTCPeerConnection &&
          window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
        return;
      }
      const origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function getSenders() {
          const senders = origGetSenders.apply(this, []);
          senders.forEach(sender => sender._pc = this);
          return senders;
        };
      }

      const origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function addTrack() {
          const sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function getStats() {
        return this.track ? this._pc.getStats(this.track) :
            Promise.resolve(new Map());
      };
    }

    function shimReceiverGetStats(window) {
      if (!(typeof window === 'object' && window.RTCPeerConnection &&
          window.RTCRtpSender)) {
        return;
      }
      if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
        return;
      }
      const origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function getReceivers() {
          const receivers = origGetReceivers.apply(this, []);
          receivers.forEach(receiver => receiver._pc = this);
          return receivers;
        };
      }
      wrapPeerConnectionEvent(window, 'track', e => {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function getStats() {
        return this._pc.getStats(this.track);
      };
    }

    function shimRemoveStream(window) {
      if (!window.RTCPeerConnection ||
          'removeStream' in window.RTCPeerConnection.prototype) {
        return;
      }
      window.RTCPeerConnection.prototype.removeStream =
        function removeStream(stream) {
          deprecated('removeStream', 'removeTrack');
          this.getSenders().forEach(sender => {
            if (sender.track && stream.getTracks().includes(sender.track)) {
              this.removeTrack(sender);
            }
          });
        };
    }

    function shimRTCDataChannel(window) {
      // rename DataChannel to RTCDataChannel (native fix in FF60):
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
      if (window.DataChannel && !window.RTCDataChannel) {
        window.RTCDataChannel = window.DataChannel;
      }
    }

    function shimAddTransceiver(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
      }
      const origAddTransceiver = window.RTCPeerConnection.prototype.addTransceiver;
      if (origAddTransceiver) {
        window.RTCPeerConnection.prototype.addTransceiver =
          function addTransceiver() {
            this.setParametersPromises = [];
            const initParameters = arguments[1];
            const shouldPerformCheck = initParameters &&
                                      'sendEncodings' in initParameters;
            if (shouldPerformCheck) {
              // If sendEncodings params are provided, validate grammar
              initParameters.sendEncodings.forEach((encodingParam) => {
                if ('rid' in encodingParam) {
                  const ridRegex = /^[a-z0-9]{0,16}$/i;
                  if (!ridRegex.test(encodingParam.rid)) {
                    throw new TypeError('Invalid RID value provided.');
                  }
                }
                if ('scaleResolutionDownBy' in encodingParam) {
                  if (!(parseFloat(encodingParam.scaleResolutionDownBy) >= 1.0)) {
                    throw new RangeError('scale_resolution_down_by must be >= 1.0');
                  }
                }
                if ('maxFramerate' in encodingParam) {
                  if (!(parseFloat(encodingParam.maxFramerate) >= 0)) {
                    throw new RangeError('max_framerate must be >= 0.0');
                  }
                }
              });
            }
            const transceiver = origAddTransceiver.apply(this, arguments);
            if (shouldPerformCheck) {
              // Check if the init options were applied. If not we do this in an
              // asynchronous way and save the promise reference in a global object.
              // This is an ugly hack, but at the same time is way more robust than
              // checking the sender parameters before and after the createOffer
              // Also note that after the createoffer we are not 100% sure that
              // the params were asynchronously applied so we might miss the
              // opportunity to recreate offer.
              const {sender} = transceiver;
              const params = sender.getParameters();
              if (!('encodings' in params) ||
                  // Avoid being fooled by patched getParameters() below.
                  (params.encodings.length === 1 &&
                   Object.keys(params.encodings[0]).length === 0)) {
                params.encodings = initParameters.sendEncodings;
                sender.sendEncodings = initParameters.sendEncodings;
                this.setParametersPromises.push(sender.setParameters(params)
                  .then(() => {
                    delete sender.sendEncodings;
                  }).catch(() => {
                    delete sender.sendEncodings;
                  })
                );
              }
            }
            return transceiver;
          };
      }
    }

    function shimGetParameters(window) {
      if (!(typeof window === 'object' && window.RTCRtpSender)) {
        return;
      }
      const origGetParameters = window.RTCRtpSender.prototype.getParameters;
      if (origGetParameters) {
        window.RTCRtpSender.prototype.getParameters =
          function getParameters() {
            const params = origGetParameters.apply(this, arguments);
            if (!('encodings' in params)) {
              params.encodings = [].concat(this.sendEncodings || [{}]);
            }
            return params;
          };
      }
    }

    function shimCreateOffer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
      }
      const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer = function createOffer() {
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises)
          .then(() => {
            return origCreateOffer.apply(this, arguments);
          })
          .finally(() => {
            this.setParametersPromises = [];
          });
        }
        return origCreateOffer.apply(this, arguments);
      };
    }

    function shimCreateAnswer(window) {
      // https://github.com/webrtcHacks/adapter/issues/998#issuecomment-516921647
      // Firefox ignores the init sendEncodings options passed to addTransceiver
      // https://bugzilla.mozilla.org/show_bug.cgi?id=1396918
      if (!(typeof window === 'object' && window.RTCPeerConnection)) {
        return;
      }
      const origCreateAnswer = window.RTCPeerConnection.prototype.createAnswer;
      window.RTCPeerConnection.prototype.createAnswer = function createAnswer() {
        if (this.setParametersPromises && this.setParametersPromises.length) {
          return Promise.all(this.setParametersPromises)
          .then(() => {
            return origCreateAnswer.apply(this, arguments);
          })
          .finally(() => {
            this.setParametersPromises = [];
          });
        }
        return origCreateAnswer.apply(this, arguments);
      };
    }

    var firefoxShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimOnTrack: shimOnTrack,
        shimPeerConnection: shimPeerConnection,
        shimSenderGetStats: shimSenderGetStats,
        shimReceiverGetStats: shimReceiverGetStats,
        shimRemoveStream: shimRemoveStream,
        shimRTCDataChannel: shimRTCDataChannel,
        shimAddTransceiver: shimAddTransceiver,
        shimGetParameters: shimGetParameters,
        shimCreateOffer: shimCreateOffer,
        shimCreateAnswer: shimCreateAnswer,
        shimGetUserMedia: shimGetUserMedia$1,
        shimGetDisplayMedia: shimGetDisplayMedia
    });

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimLocalStreamsAPI(window) {
      if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getLocalStreams =
          function getLocalStreams() {
            if (!this._localStreams) {
              this._localStreams = [];
            }
            return this._localStreams;
          };
      }
      if (!('addStream' in window.RTCPeerConnection.prototype)) {
        const _addTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addStream = function addStream(stream) {
          if (!this._localStreams) {
            this._localStreams = [];
          }
          if (!this._localStreams.includes(stream)) {
            this._localStreams.push(stream);
          }
          // Try to emulate Chrome's behaviour of adding in audio-video order.
          // Safari orders by track id.
          stream.getAudioTracks().forEach(track => _addTrack.call(this, track,
            stream));
          stream.getVideoTracks().forEach(track => _addTrack.call(this, track,
            stream));
        };

        window.RTCPeerConnection.prototype.addTrack =
          function addTrack(track, ...streams) {
            if (streams) {
              streams.forEach((stream) => {
                if (!this._localStreams) {
                  this._localStreams = [stream];
                } else if (!this._localStreams.includes(stream)) {
                  this._localStreams.push(stream);
                }
              });
            }
            return _addTrack.apply(this, arguments);
          };
      }
      if (!('removeStream' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.removeStream =
          function removeStream(stream) {
            if (!this._localStreams) {
              this._localStreams = [];
            }
            const index = this._localStreams.indexOf(stream);
            if (index === -1) {
              return;
            }
            this._localStreams.splice(index, 1);
            const tracks = stream.getTracks();
            this.getSenders().forEach(sender => {
              if (tracks.includes(sender.track)) {
                this.removeTrack(sender);
              }
            });
          };
      }
    }

    function shimRemoteStreamsAPI(window) {
      if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
        window.RTCPeerConnection.prototype.getRemoteStreams =
          function getRemoteStreams() {
            return this._remoteStreams ? this._remoteStreams : [];
          };
      }
      if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
          get() {
            return this._onaddstream;
          },
          set(f) {
            if (this._onaddstream) {
              this.removeEventListener('addstream', this._onaddstream);
              this.removeEventListener('track', this._onaddstreampoly);
            }
            this.addEventListener('addstream', this._onaddstream = f);
            this.addEventListener('track', this._onaddstreampoly = (e) => {
              e.streams.forEach(stream => {
                if (!this._remoteStreams) {
                  this._remoteStreams = [];
                }
                if (this._remoteStreams.includes(stream)) {
                  return;
                }
                this._remoteStreams.push(stream);
                const event = new Event('addstream');
                event.stream = stream;
                this.dispatchEvent(event);
              });
            });
          }
        });
        const origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
        window.RTCPeerConnection.prototype.setRemoteDescription =
          function setRemoteDescription() {
            const pc = this;
            if (!this._onaddstreampoly) {
              this.addEventListener('track', this._onaddstreampoly = function(e) {
                e.streams.forEach(stream => {
                  if (!pc._remoteStreams) {
                    pc._remoteStreams = [];
                  }
                  if (pc._remoteStreams.indexOf(stream) >= 0) {
                    return;
                  }
                  pc._remoteStreams.push(stream);
                  const event = new Event('addstream');
                  event.stream = stream;
                  pc.dispatchEvent(event);
                });
              });
            }
            return origSetRemoteDescription.apply(pc, arguments);
          };
      }
    }

    function shimCallbacksAPI(window) {
      if (typeof window !== 'object' || !window.RTCPeerConnection) {
        return;
      }
      const prototype = window.RTCPeerConnection.prototype;
      const origCreateOffer = prototype.createOffer;
      const origCreateAnswer = prototype.createAnswer;
      const setLocalDescription = prototype.setLocalDescription;
      const setRemoteDescription = prototype.setRemoteDescription;
      const addIceCandidate = prototype.addIceCandidate;

      prototype.createOffer =
        function createOffer(successCallback, failureCallback) {
          const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
          const promise = origCreateOffer.apply(this, [options]);
          if (!failureCallback) {
            return promise;
          }
          promise.then(successCallback, failureCallback);
          return Promise.resolve();
        };

      prototype.createAnswer =
        function createAnswer(successCallback, failureCallback) {
          const options = (arguments.length >= 2) ? arguments[2] : arguments[0];
          const promise = origCreateAnswer.apply(this, [options]);
          if (!failureCallback) {
            return promise;
          }
          promise.then(successCallback, failureCallback);
          return Promise.resolve();
        };

      let withCallback = function(description, successCallback, failureCallback) {
        const promise = setLocalDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setLocalDescription = withCallback;

      withCallback = function(description, successCallback, failureCallback) {
        const promise = setRemoteDescription.apply(this, [description]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.setRemoteDescription = withCallback;

      withCallback = function(candidate, successCallback, failureCallback) {
        const promise = addIceCandidate.apply(this, [candidate]);
        if (!failureCallback) {
          return promise;
        }
        promise.then(successCallback, failureCallback);
        return Promise.resolve();
      };
      prototype.addIceCandidate = withCallback;
    }

    function shimGetUserMedia(window) {
      const navigator = window && window.navigator;

      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // shim not needed in Safari 12.1
        const mediaDevices = navigator.mediaDevices;
        const _getUserMedia = mediaDevices.getUserMedia.bind(mediaDevices);
        navigator.mediaDevices.getUserMedia = (constraints) => {
          return _getUserMedia(shimConstraints(constraints));
        };
      }

      if (!navigator.getUserMedia && navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function getUserMedia(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }

    function shimConstraints(constraints) {
      if (constraints && constraints.video !== undefined) {
        return Object.assign({},
          constraints,
          {video: compactObject(constraints.video)}
        );
      }

      return constraints;
    }

    function shimRTCIceServerUrls(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
      const OrigPeerConnection = window.RTCPeerConnection;
      window.RTCPeerConnection =
        function RTCPeerConnection(pcConfig, pcConstraints) {
          if (pcConfig && pcConfig.iceServers) {
            const newIceServers = [];
            for (let i = 0; i < pcConfig.iceServers.length; i++) {
              let server = pcConfig.iceServers[i];
              if (!server.hasOwnProperty('urls') &&
                  server.hasOwnProperty('url')) {
                deprecated('RTCIceServer.url', 'RTCIceServer.urls');
                server = JSON.parse(JSON.stringify(server));
                server.urls = server.url;
                delete server.url;
                newIceServers.push(server);
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
          return new OrigPeerConnection(pcConfig, pcConstraints);
        };
      window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if ('generateCertificate' in OrigPeerConnection) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get() {
            return OrigPeerConnection.generateCertificate;
          }
        });
      }
    }

    function shimTrackEventTransceiver(window) {
      // Add event.transceiver member over deprecated event.receiver
      if (typeof window === 'object' && window.RTCTrackEvent &&
          'receiver' in window.RTCTrackEvent.prototype &&
          !('transceiver' in window.RTCTrackEvent.prototype)) {
        Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
          get() {
            return {receiver: this.receiver};
          }
        });
      }
    }

    function shimCreateOfferLegacy(window) {
      const origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
      window.RTCPeerConnection.prototype.createOffer =
        function createOffer(offerOptions) {
          if (offerOptions) {
            if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
              // support bit values
              offerOptions.offerToReceiveAudio =
                !!offerOptions.offerToReceiveAudio;
            }
            const audioTransceiver = this.getTransceivers().find(transceiver =>
              transceiver.receiver.track.kind === 'audio');
            if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
              if (audioTransceiver.direction === 'sendrecv') {
                if (audioTransceiver.setDirection) {
                  audioTransceiver.setDirection('sendonly');
                } else {
                  audioTransceiver.direction = 'sendonly';
                }
              } else if (audioTransceiver.direction === 'recvonly') {
                if (audioTransceiver.setDirection) {
                  audioTransceiver.setDirection('inactive');
                } else {
                  audioTransceiver.direction = 'inactive';
                }
              }
            } else if (offerOptions.offerToReceiveAudio === true &&
                !audioTransceiver) {
              this.addTransceiver('audio');
            }

            if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
              // support bit values
              offerOptions.offerToReceiveVideo =
                !!offerOptions.offerToReceiveVideo;
            }
            const videoTransceiver = this.getTransceivers().find(transceiver =>
              transceiver.receiver.track.kind === 'video');
            if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
              if (videoTransceiver.direction === 'sendrecv') {
                if (videoTransceiver.setDirection) {
                  videoTransceiver.setDirection('sendonly');
                } else {
                  videoTransceiver.direction = 'sendonly';
                }
              } else if (videoTransceiver.direction === 'recvonly') {
                if (videoTransceiver.setDirection) {
                  videoTransceiver.setDirection('inactive');
                } else {
                  videoTransceiver.direction = 'inactive';
                }
              }
            } else if (offerOptions.offerToReceiveVideo === true &&
                !videoTransceiver) {
              this.addTransceiver('video');
            }
          }
          return origCreateOffer.apply(this, arguments);
        };
    }

    function shimAudioContext(window) {
      if (typeof window !== 'object' || window.AudioContext) {
        return;
      }
      window.AudioContext = window.webkitAudioContext;
    }

    var safariShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimLocalStreamsAPI: shimLocalStreamsAPI,
        shimRemoteStreamsAPI: shimRemoteStreamsAPI,
        shimCallbacksAPI: shimCallbacksAPI,
        shimGetUserMedia: shimGetUserMedia,
        shimConstraints: shimConstraints,
        shimRTCIceServerUrls: shimRTCIceServerUrls,
        shimTrackEventTransceiver: shimTrackEventTransceiver,
        shimCreateOfferLegacy: shimCreateOfferLegacy,
        shimAudioContext: shimAudioContext
    });

    /*
     *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    function shimRTCIceCandidate(window) {
      // foundation is arbitrarily chosen as an indicator for full support for
      // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
      if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
          window.RTCIceCandidate.prototype)) {
        return;
      }

      const NativeRTCIceCandidate = window.RTCIceCandidate;
      window.RTCIceCandidate = function RTCIceCandidate(args) {
        // Remove the a= which shouldn't be part of the candidate string.
        if (typeof args === 'object' && args.candidate &&
            args.candidate.indexOf('a=') === 0) {
          args = JSON.parse(JSON.stringify(args));
          args.candidate = args.candidate.substr(2);
        }

        if (args.candidate && args.candidate.length) {
          // Augment the native candidate with the parsed fields.
          const nativeCandidate = new NativeRTCIceCandidate(args);
          const parsedCandidate = sdp.parseCandidate(args.candidate);
          const augmentedCandidate = Object.assign(nativeCandidate,
              parsedCandidate);

          // Add a serializer that does not serialize the extra attributes.
          augmentedCandidate.toJSON = function toJSON() {
            return {
              candidate: augmentedCandidate.candidate,
              sdpMid: augmentedCandidate.sdpMid,
              sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
              usernameFragment: augmentedCandidate.usernameFragment,
            };
          };
          return augmentedCandidate;
        }
        return new NativeRTCIceCandidate(args);
      };
      window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

      // Hook up the augmented candidate in onicecandidate and
      // addEventListener('icecandidate', ...)
      wrapPeerConnectionEvent(window, 'icecandidate', e => {
        if (e.candidate) {
          Object.defineProperty(e, 'candidate', {
            value: new window.RTCIceCandidate(e.candidate),
            writable: 'false'
          });
        }
        return e;
      });
    }

    function shimMaxMessageSize(window) {
      if (!window.RTCPeerConnection) {
        return;
      }
      const browserDetails = detectBrowser(window);

      if (!('sctp' in window.RTCPeerConnection.prototype)) {
        Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
          get() {
            return typeof this._sctp === 'undefined' ? null : this._sctp;
          }
        });
      }

      const sctpInDescription = function(description) {
        if (!description || !description.sdp) {
          return false;
        }
        const sections = sdp.splitSections(description.sdp);
        sections.shift();
        return sections.some(mediaSection => {
          const mLine = sdp.parseMLine(mediaSection);
          return mLine && mLine.kind === 'application'
              && mLine.protocol.indexOf('SCTP') !== -1;
        });
      };

      const getRemoteFirefoxVersion = function(description) {
        // TODO: Is there a better solution for detecting Firefox?
        const match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
        if (match === null || match.length < 2) {
          return -1;
        }
        const version = parseInt(match[1], 10);
        // Test for NaN (yes, this is ugly)
        return version !== version ? -1 : version;
      };

      const getCanSendMaxMessageSize = function(remoteIsFirefox) {
        // Every implementation we know can send at least 64 KiB.
        // Note: Although Chrome is technically able to send up to 256 KiB, the
        //       data does not reach the other peer reliably.
        //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
        let canSendMaxMessageSize = 65536;
        if (browserDetails.browser === 'firefox') {
          if (browserDetails.version < 57) {
            if (remoteIsFirefox === -1) {
              // FF < 57 will send in 16 KiB chunks using the deprecated PPID
              // fragmentation.
              canSendMaxMessageSize = 16384;
            } else {
              // However, other FF (and RAWRTC) can reassemble PPID-fragmented
              // messages. Thus, supporting ~2 GiB when sending.
              canSendMaxMessageSize = 2147483637;
            }
          } else if (browserDetails.version < 60) {
            // Currently, all FF >= 57 will reset the remote maximum message size
            // to the default value when a data channel is created at a later
            // stage. :(
            // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
            canSendMaxMessageSize =
              browserDetails.version === 57 ? 65535 : 65536;
          } else {
            // FF >= 60 supports sending ~2 GiB
            canSendMaxMessageSize = 2147483637;
          }
        }
        return canSendMaxMessageSize;
      };

      const getMaxMessageSize = function(description, remoteIsFirefox) {
        // Note: 65536 bytes is the default value from the SDP spec. Also,
        //       every implementation we know supports receiving 65536 bytes.
        let maxMessageSize = 65536;

        // FF 57 has a slightly incorrect default remote max message size, so
        // we need to adjust it here to avoid a failure when sending.
        // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
        if (browserDetails.browser === 'firefox'
             && browserDetails.version === 57) {
          maxMessageSize = 65535;
        }

        const match = sdp.matchPrefix(description.sdp,
          'a=max-message-size:');
        if (match.length > 0) {
          maxMessageSize = parseInt(match[0].substr(19), 10);
        } else if (browserDetails.browser === 'firefox' &&
                    remoteIsFirefox !== -1) {
          // If the maximum message size is not present in the remote SDP and
          // both local and remote are Firefox, the remote peer can receive
          // ~2 GiB.
          maxMessageSize = 2147483637;
        }
        return maxMessageSize;
      };

      const origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription =
        function setRemoteDescription() {
          this._sctp = null;
          // Chrome decided to not expose .sctp in plan-b mode.
          // As usual, adapter.js has to do an 'ugly worakaround'
          // to cover up the mess.
          if (browserDetails.browser === 'chrome' && browserDetails.version >= 76) {
            const {sdpSemantics} = this.getConfiguration();
            if (sdpSemantics === 'plan-b') {
              Object.defineProperty(this, 'sctp', {
                get() {
                  return typeof this._sctp === 'undefined' ? null : this._sctp;
                },
                enumerable: true,
                configurable: true,
              });
            }
          }

          if (sctpInDescription(arguments[0])) {
            // Check if the remote is FF.
            const isFirefox = getRemoteFirefoxVersion(arguments[0]);

            // Get the maximum message size the local peer is capable of sending
            const canSendMMS = getCanSendMaxMessageSize(isFirefox);

            // Get the maximum message size of the remote peer.
            const remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

            // Determine final maximum message size
            let maxMessageSize;
            if (canSendMMS === 0 && remoteMMS === 0) {
              maxMessageSize = Number.POSITIVE_INFINITY;
            } else if (canSendMMS === 0 || remoteMMS === 0) {
              maxMessageSize = Math.max(canSendMMS, remoteMMS);
            } else {
              maxMessageSize = Math.min(canSendMMS, remoteMMS);
            }

            // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
            // attribute.
            const sctp = {};
            Object.defineProperty(sctp, 'maxMessageSize', {
              get() {
                return maxMessageSize;
              }
            });
            this._sctp = sctp;
          }

          return origSetRemoteDescription.apply(this, arguments);
        };
    }

    function shimSendThrowTypeError(window) {
      if (!(window.RTCPeerConnection &&
          'createDataChannel' in window.RTCPeerConnection.prototype)) {
        return;
      }

      // Note: Although Firefox >= 57 has a native implementation, the maximum
      //       message size can be reset for all data channels at a later stage.
      //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

      function wrapDcSend(dc, pc) {
        const origDataChannelSend = dc.send;
        dc.send = function send() {
          const data = arguments[0];
          const length = data.length || data.size || data.byteLength;
          if (dc.readyState === 'open' &&
              pc.sctp && length > pc.sctp.maxMessageSize) {
            throw new TypeError('Message too large (can send a maximum of ' +
              pc.sctp.maxMessageSize + ' bytes)');
          }
          return origDataChannelSend.apply(dc, arguments);
        };
      }
      const origCreateDataChannel =
        window.RTCPeerConnection.prototype.createDataChannel;
      window.RTCPeerConnection.prototype.createDataChannel =
        function createDataChannel() {
          const dataChannel = origCreateDataChannel.apply(this, arguments);
          wrapDcSend(dataChannel, this);
          return dataChannel;
        };
      wrapPeerConnectionEvent(window, 'datachannel', e => {
        wrapDcSend(e.channel, e.target);
        return e;
      });
    }


    /* shims RTCConnectionState by pretending it is the same as iceConnectionState.
     * See https://bugs.chromium.org/p/webrtc/issues/detail?id=6145#c12
     * for why this is a valid hack in Chrome. In Firefox it is slightly incorrect
     * since DTLS failures would be hidden. See
     * https://bugzilla.mozilla.org/show_bug.cgi?id=1265827
     * for the Firefox tracking bug.
     */
    function shimConnectionState(window) {
      if (!window.RTCPeerConnection ||
          'connectionState' in window.RTCPeerConnection.prototype) {
        return;
      }
      const proto = window.RTCPeerConnection.prototype;
      Object.defineProperty(proto, 'connectionState', {
        get() {
          return {
            completed: 'connected',
            checking: 'connecting'
          }[this.iceConnectionState] || this.iceConnectionState;
        },
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(proto, 'onconnectionstatechange', {
        get() {
          return this._onconnectionstatechange || null;
        },
        set(cb) {
          if (this._onconnectionstatechange) {
            this.removeEventListener('connectionstatechange',
                this._onconnectionstatechange);
            delete this._onconnectionstatechange;
          }
          if (cb) {
            this.addEventListener('connectionstatechange',
                this._onconnectionstatechange = cb);
          }
        },
        enumerable: true,
        configurable: true
      });

      ['setLocalDescription', 'setRemoteDescription'].forEach((method) => {
        const origMethod = proto[method];
        proto[method] = function() {
          if (!this._connectionstatechangepoly) {
            this._connectionstatechangepoly = e => {
              const pc = e.target;
              if (pc._lastConnectionState !== pc.connectionState) {
                pc._lastConnectionState = pc.connectionState;
                const newEvent = new Event('connectionstatechange', e);
                pc.dispatchEvent(newEvent);
              }
              return e;
            };
            this.addEventListener('iceconnectionstatechange',
              this._connectionstatechangepoly);
          }
          return origMethod.apply(this, arguments);
        };
      });
    }

    function removeAllowExtmapMixed(window) {
      /* remove a=extmap-allow-mixed for webrtc.org < M71 */
      if (!window.RTCPeerConnection) {
        return;
      }
      const browserDetails = detectBrowser(window);
      if (browserDetails.browser === 'chrome' && browserDetails.version >= 71) {
        return;
      }
      if (browserDetails.browser === 'safari' && browserDetails.version >= 605) {
        return;
      }
      const nativeSRD = window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription =
      function setRemoteDescription(desc) {
        if (desc && desc.sdp && desc.sdp.indexOf('\na=extmap-allow-mixed') !== -1) {
          desc.sdp = desc.sdp.split('\n').filter((line) => {
            return line.trim() !== 'a=extmap-allow-mixed';
          }).join('\n');
        }
        return nativeSRD.apply(this, arguments);
      };
    }

    var commonShim = /*#__PURE__*/Object.freeze({
        __proto__: null,
        shimRTCIceCandidate: shimRTCIceCandidate,
        shimMaxMessageSize: shimMaxMessageSize,
        shimSendThrowTypeError: shimSendThrowTypeError,
        shimConnectionState: shimConnectionState,
        removeAllowExtmapMixed: removeAllowExtmapMixed
    });

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    // Shimming starts here.
    function adapterFactory({window} = {}, options = {
      shimChrome: true,
      shimFirefox: true,
      shimEdge: true,
      shimSafari: true,
    }) {
      // Utils.
      const logging = log;
      const browserDetails = detectBrowser(window);

      const adapter = {
        browserDetails,
        commonShim,
        extractVersion: extractVersion,
        disableLog: disableLog,
        disableWarnings: disableWarnings
      };

      // Shim browser if found.
      switch (browserDetails.browser) {
        case 'chrome':
          if (!chromeShim || !shimPeerConnection$2 ||
              !options.shimChrome) {
            logging('Chrome shim is not included in this adapter release.');
            return adapter;
          }
          if (browserDetails.version === null) {
            logging('Chrome shim can not determine version, not shimming.');
            return adapter;
          }
          logging('adapter.js shimming chrome.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = chromeShim;

          shimGetUserMedia$3(window);
          shimMediaStream(window);
          shimPeerConnection$2(window);
          shimOnTrack$1(window);
          shimAddTrackRemoveTrack(window);
          shimGetSendersWithDtmf(window);
          shimGetStats(window);
          shimSenderReceiverGetStats(window);
          fixNegotiationNeeded(window);

          shimRTCIceCandidate(window);
          shimConnectionState(window);
          shimMaxMessageSize(window);
          shimSendThrowTypeError(window);
          removeAllowExtmapMixed(window);
          break;
        case 'firefox':
          if (!firefoxShim || !shimPeerConnection ||
              !options.shimFirefox) {
            logging('Firefox shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming firefox.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = firefoxShim;

          shimGetUserMedia$1(window);
          shimPeerConnection(window);
          shimOnTrack(window);
          shimRemoveStream(window);
          shimSenderGetStats(window);
          shimReceiverGetStats(window);
          shimRTCDataChannel(window);
          shimAddTransceiver(window);
          shimGetParameters(window);
          shimCreateOffer(window);
          shimCreateAnswer(window);

          shimRTCIceCandidate(window);
          shimConnectionState(window);
          shimMaxMessageSize(window);
          shimSendThrowTypeError(window);
          break;
        case 'edge':
          if (!edgeShim || !shimPeerConnection$1 || !options.shimEdge) {
            logging('MS edge shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming edge.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = edgeShim;

          shimGetUserMedia$2(window);
          shimGetDisplayMedia$1(window);
          shimPeerConnection$1(window);
          shimReplaceTrack(window);

          // the edge shim implements the full RTCIceCandidate object.

          shimMaxMessageSize(window);
          shimSendThrowTypeError(window);
          break;
        case 'safari':
          if (!safariShim || !options.shimSafari) {
            logging('Safari shim is not included in this adapter release.');
            return adapter;
          }
          logging('adapter.js shimming safari.');
          // Export to the adapter global object visible in the browser.
          adapter.browserShim = safariShim;

          shimRTCIceServerUrls(window);
          shimCreateOfferLegacy(window);
          shimCallbacksAPI(window);
          shimLocalStreamsAPI(window);
          shimRemoteStreamsAPI(window);
          shimTrackEventTransceiver(window);
          shimGetUserMedia(window);
          shimAudioContext(window);

          shimRTCIceCandidate(window);
          shimMaxMessageSize(window);
          shimSendThrowTypeError(window);
          removeAllowExtmapMixed(window);
          break;
        default:
          logging('Unsupported browser!');
          break;
      }

      return adapter;
    }

    /*
     *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
     *
     *  Use of this source code is governed by a BSD-style license
     *  that can be found in the LICENSE file in the root of the source
     *  tree.
     */

    const adapter =
      adapterFactory({window: typeof window === 'undefined' ? undefined : window});

    var libvpx_1 = createCommonjsModule(function (module, exports) {
    var libvpx = (function() {
      typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
      
      return (
    function(libvpx) {
      libvpx = libvpx || {};

    var Module=typeof libvpx!=="undefined"?libvpx:{};var readyPromiseResolve,readyPromiseReject;Module["ready"]=new Promise(function(resolve,reject){readyPromiseResolve=resolve;readyPromiseReject=reject;});var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key];}}var ENVIRONMENT_IS_WEB=true;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var readBinary;{if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src;}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1);}else {scriptDirectory="";}}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key];}}moduleOverrides=null;if(Module["arguments"])Module["arguments"];if(Module["thisProgram"])Module["thisProgram"];if(Module["quit"])Module["quit"];var tempRet0=0;var setTempRet0=function(value){tempRet0=value;};var getTempRet0=function(){return tempRet0};var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected");}var wasmMemory;var ABORT=false;function assert(condition,text){if(!condition){abort("Assertion failed: "+text);}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else {var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2;}else {u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63;}if(u0<65536){str+=String.fromCharCode(u0);}else {var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023;}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u;}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63;}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}else {if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63;}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4;}return len}var UTF16Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf-16le"):undefined;function UTF16ToString(ptr,maxBytesToRead){var endPtr=ptr;var idx=endPtr>>1;var maxIdx=idx+maxBytesToRead/2;while(!(idx>=maxIdx)&&HEAPU16[idx])++idx;endPtr=idx<<1;if(endPtr-ptr>32&&UTF16Decoder){return UTF16Decoder.decode(HEAPU8.subarray(ptr,endPtr))}else {var str="";for(var i=0;!(i>=maxBytesToRead/2);++i){var codeUnit=HEAP16[ptr+i*2>>1];if(codeUnit==0)break;str+=String.fromCharCode(codeUnit);}return str}}function stringToUTF16(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647;}if(maxBytesToWrite<2)return 0;maxBytesToWrite-=2;var startPtr=outPtr;var numCharsToWrite=maxBytesToWrite<str.length*2?maxBytesToWrite/2:str.length;for(var i=0;i<numCharsToWrite;++i){var codeUnit=str.charCodeAt(i);HEAP16[outPtr>>1]=codeUnit;outPtr+=2;}HEAP16[outPtr>>1]=0;return outPtr-startPtr}function lengthBytesUTF16(str){return str.length*2}function UTF32ToString(ptr,maxBytesToRead){var i=0;var str="";while(!(i>=maxBytesToRead/4)){var utf32=HEAP32[ptr+i*4>>2];if(utf32==0)break;++i;if(utf32>=65536){var ch=utf32-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023);}else {str+=String.fromCharCode(utf32);}}return str}function stringToUTF32(str,outPtr,maxBytesToWrite){if(maxBytesToWrite===undefined){maxBytesToWrite=2147483647;}if(maxBytesToWrite<4)return 0;var startPtr=outPtr;var endPtr=startPtr+maxBytesToWrite-4;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343){var trailSurrogate=str.charCodeAt(++i);codeUnit=65536+((codeUnit&1023)<<10)|trailSurrogate&1023;}HEAP32[outPtr>>2]=codeUnit;outPtr+=4;if(outPtr+4>endPtr)break}HEAP32[outPtr>>2]=0;return outPtr-startPtr}function lengthBytesUTF32(str){var len=0;for(var i=0;i<str.length;++i){var codeUnit=str.charCodeAt(i);if(codeUnit>=55296&&codeUnit<=57343)++i;len+=4;}return len}function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple;}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf);}Module["INITIAL_MEMORY"]||16777216;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATPOSTRUN__=[];function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift());}}callRuntimeCallbacks(__ATPRERUN__);}function initRuntime(){callRuntimeCallbacks(__ATINIT__);}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift());}}callRuntimeCallbacks(__ATPOSTRUN__);}function addOnPreRun(cb){__ATPRERUN__.unshift(cb);}function addOnInit(cb){__ATINIT__.unshift(cb);}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb);}var runDependencies=0;var dependenciesFulfilled=null;function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies);}if(runDependencies==0){if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback();}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what);}what+="";err(what);ABORT=true;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);readyPromiseReject(e);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}var wasmBinaryFile;wasmBinaryFile="libvpx.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile);}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary);else {throw "both async and sync fetching of the wasm failed"}}catch(err){abort(err);}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB)){if(typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw "failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["M"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["Q"];addOnInit(Module["asm"]["N"]);removeRunDependency();}addRunDependency();function receiveInstantiationResult(result){receiveInstance(result["instance"]);}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){var result=WebAssembly.instantiate(binary,info);return result}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason);})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else {return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync().catch(readyPromiseReject);return {}}function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){wasmTable.get(func)();}else {wasmTable.get(func)(callback.arg);}}else {func(callback.arg===undefined?null:callback.arg);}}}function __embind_register_bigint(primitiveType,name,size,minRange,maxRange){}function getShiftFromSize(size){switch(size){case 1:return 0;case 2:return 1;case 4:return 2;case 8:return 3;default:throw new TypeError("Unknown type size: "+size)}}function embind_init_charCodes(){var codes=new Array(256);for(var i=0;i<256;++i){codes[i]=String.fromCharCode(i);}embind_charCodes=codes;}var embind_charCodes=undefined;function readLatin1String(ptr){var ret="";var c=ptr;while(HEAPU8[c]){ret+=embind_charCodes[HEAPU8[c++]];}return ret}var awaitingDependencies={};var registeredTypes={};var typeDependencies={};var char_0=48;var char_9=57;function makeLegalFunctionName(name){if(undefined===name){return "_unknown"}name=name.replace(/[^a-zA-Z0-9_]/g,"$");var f=name.charCodeAt(0);if(f>=char_0&&f<=char_9){return "_"+name}else {return name}}function createNamedFunction(name,body){name=makeLegalFunctionName(name);return function(){return body.apply(this,arguments)}}function extendError(baseErrorType,errorName){var errorClass=createNamedFunction(errorName,function(message){this.name=errorName;this.message=message;var stack=new Error(message).stack;if(stack!==undefined){this.stack=this.toString()+"\n"+stack.replace(/^Error(:[^\n]*)?\n/,"");}});errorClass.prototype=Object.create(baseErrorType.prototype);errorClass.prototype.constructor=errorClass;errorClass.prototype.toString=function(){if(this.message===undefined){return this.name}else {return this.name+": "+this.message}};return errorClass}var BindingError=undefined;function throwBindingError(message){throw new BindingError(message)}var InternalError=undefined;function throwInternalError(message){throw new InternalError(message)}function whenDependentTypesAreResolved(myTypes,dependentTypes,getTypeConverters){myTypes.forEach(function(type){typeDependencies[type]=dependentTypes;});function onComplete(typeConverters){var myTypeConverters=getTypeConverters(typeConverters);if(myTypeConverters.length!==myTypes.length){throwInternalError("Mismatched type converter count");}for(var i=0;i<myTypes.length;++i){registerType(myTypes[i],myTypeConverters[i]);}}var typeConverters=new Array(dependentTypes.length);var unregisteredTypes=[];var registered=0;dependentTypes.forEach(function(dt,i){if(registeredTypes.hasOwnProperty(dt)){typeConverters[i]=registeredTypes[dt];}else {unregisteredTypes.push(dt);if(!awaitingDependencies.hasOwnProperty(dt)){awaitingDependencies[dt]=[];}awaitingDependencies[dt].push(function(){typeConverters[i]=registeredTypes[dt];++registered;if(registered===unregisteredTypes.length){onComplete(typeConverters);}});}});if(0===unregisteredTypes.length){onComplete(typeConverters);}}function registerType(rawType,registeredInstance,options){options=options||{};if(!("argPackAdvance"in registeredInstance)){throw new TypeError("registerType registeredInstance requires argPackAdvance")}var name=registeredInstance.name;if(!rawType){throwBindingError('type "'+name+'" must have a positive integer typeid pointer');}if(registeredTypes.hasOwnProperty(rawType)){if(options.ignoreDuplicateRegistrations){return}else {throwBindingError("Cannot register type '"+name+"' twice");}}registeredTypes[rawType]=registeredInstance;delete typeDependencies[rawType];if(awaitingDependencies.hasOwnProperty(rawType)){var callbacks=awaitingDependencies[rawType];delete awaitingDependencies[rawType];callbacks.forEach(function(cb){cb();});}}function __embind_register_bool(rawType,name,size,trueValue,falseValue){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(wt){return !!wt},"toWireType":function(destructors,o){return o?trueValue:falseValue},"argPackAdvance":8,"readValueFromPointer":function(pointer){var heap;if(size===1){heap=HEAP8;}else if(size===2){heap=HEAP16;}else if(size===4){heap=HEAP32;}else {throw new TypeError("Unknown boolean type size: "+name)}return this["fromWireType"](heap[pointer>>shift])},destructorFunction:null});}function ClassHandle_isAliasOf(other){if(!(this instanceof ClassHandle)){return false}if(!(other instanceof ClassHandle)){return false}var leftClass=this.$$.ptrType.registeredClass;var left=this.$$.ptr;var rightClass=other.$$.ptrType.registeredClass;var right=other.$$.ptr;while(leftClass.baseClass){left=leftClass.upcast(left);leftClass=leftClass.baseClass;}while(rightClass.baseClass){right=rightClass.upcast(right);rightClass=rightClass.baseClass;}return leftClass===rightClass&&left===right}function shallowCopyInternalPointer(o){return {count:o.count,deleteScheduled:o.deleteScheduled,preservePointerOnDelete:o.preservePointerOnDelete,ptr:o.ptr,ptrType:o.ptrType,smartPtr:o.smartPtr,smartPtrType:o.smartPtrType}}function throwInstanceAlreadyDeleted(obj){function getInstanceTypeName(handle){return handle.$$.ptrType.registeredClass.name}throwBindingError(getInstanceTypeName(obj)+" instance already deleted");}var finalizationGroup=false;function detachFinalizer(handle){}function runDestructor($$){if($$.smartPtr){$$.smartPtrType.rawDestructor($$.smartPtr);}else {$$.ptrType.registeredClass.rawDestructor($$.ptr);}}function releaseClassHandle($$){$$.count.value-=1;var toDelete=0===$$.count.value;if(toDelete){runDestructor($$);}}function attachFinalizer(handle){if("undefined"===typeof FinalizationGroup){attachFinalizer=function(handle){return handle};return handle}finalizationGroup=new FinalizationGroup(function(iter){for(var result=iter.next();!result.done;result=iter.next()){var $$=result.value;if(!$$.ptr){console.warn("object already deleted: "+$$.ptr);}else {releaseClassHandle($$);}}});attachFinalizer=function(handle){finalizationGroup.register(handle,handle.$$,handle.$$);return handle};detachFinalizer=function(handle){finalizationGroup.unregister(handle.$$);};return attachFinalizer(handle)}function ClassHandle_clone(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.preservePointerOnDelete){this.$$.count.value+=1;return this}else {var clone=attachFinalizer(Object.create(Object.getPrototypeOf(this),{$$:{value:shallowCopyInternalPointer(this.$$)}}));clone.$$.count.value+=1;clone.$$.deleteScheduled=false;return clone}}function ClassHandle_delete(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}detachFinalizer(this);releaseClassHandle(this.$$);if(!this.$$.preservePointerOnDelete){this.$$.smartPtr=undefined;this.$$.ptr=undefined;}}function ClassHandle_isDeleted(){return !this.$$.ptr}var delayFunction=undefined;var deletionQueue=[];function flushPendingDeletes(){while(deletionQueue.length){var obj=deletionQueue.pop();obj.$$.deleteScheduled=false;obj["delete"]();}}function ClassHandle_deleteLater(){if(!this.$$.ptr){throwInstanceAlreadyDeleted(this);}if(this.$$.deleteScheduled&&!this.$$.preservePointerOnDelete){throwBindingError("Object already scheduled for deletion");}deletionQueue.push(this);if(deletionQueue.length===1&&delayFunction){delayFunction(flushPendingDeletes);}this.$$.deleteScheduled=true;return this}function init_ClassHandle(){ClassHandle.prototype["isAliasOf"]=ClassHandle_isAliasOf;ClassHandle.prototype["clone"]=ClassHandle_clone;ClassHandle.prototype["delete"]=ClassHandle_delete;ClassHandle.prototype["isDeleted"]=ClassHandle_isDeleted;ClassHandle.prototype["deleteLater"]=ClassHandle_deleteLater;}function ClassHandle(){}var registeredPointers={};function ensureOverloadTable(proto,methodName,humanName){if(undefined===proto[methodName].overloadTable){var prevFunc=proto[methodName];proto[methodName]=function(){if(!proto[methodName].overloadTable.hasOwnProperty(arguments.length)){throwBindingError("Function '"+humanName+"' called with an invalid number of arguments ("+arguments.length+") - expects one of ("+proto[methodName].overloadTable+")!");}return proto[methodName].overloadTable[arguments.length].apply(this,arguments)};proto[methodName].overloadTable=[];proto[methodName].overloadTable[prevFunc.argCount]=prevFunc;}}function exposePublicSymbol(name,value,numArguments){if(Module.hasOwnProperty(name)){if(undefined===numArguments||undefined!==Module[name].overloadTable&&undefined!==Module[name].overloadTable[numArguments]){throwBindingError("Cannot register public name '"+name+"' twice");}ensureOverloadTable(Module,name,name);if(Module.hasOwnProperty(numArguments)){throwBindingError("Cannot register multiple overloads of a function with the same number of arguments ("+numArguments+")!");}Module[name].overloadTable[numArguments]=value;}else {Module[name]=value;if(undefined!==numArguments){Module[name].numArguments=numArguments;}}}function RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast){this.name=name;this.constructor=constructor;this.instancePrototype=instancePrototype;this.rawDestructor=rawDestructor;this.baseClass=baseClass;this.getActualType=getActualType;this.upcast=upcast;this.downcast=downcast;this.pureVirtualFunctions=[];}function upcastPointer(ptr,ptrClass,desiredClass){while(ptrClass!==desiredClass){if(!ptrClass.upcast){throwBindingError("Expected null or instance of "+desiredClass.name+", got an instance of "+ptrClass.name);}ptr=ptrClass.upcast(ptr);ptrClass=ptrClass.baseClass;}return ptr}function constNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function genericPointerToWireType(destructors,handle){var ptr;if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}if(this.isSmartPointer){ptr=this.rawConstructor();if(destructors!==null){destructors.push(this.rawDestructor,ptr);}return ptr}else {return 0}}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(!this.isConst&&handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);if(this.isSmartPointer){if(undefined===handle.$$.smartPtr){throwBindingError("Passing raw pointer to smart pointer is illegal");}switch(this.sharingPolicy){case 0:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else {throwBindingError("Cannot convert argument of type "+(handle.$$.smartPtrType?handle.$$.smartPtrType.name:handle.$$.ptrType.name)+" to parameter type "+this.name);}break;case 1:ptr=handle.$$.smartPtr;break;case 2:if(handle.$$.smartPtrType===this){ptr=handle.$$.smartPtr;}else {var clonedHandle=handle["clone"]();ptr=this.rawShare(ptr,__emval_register(function(){clonedHandle["delete"]();}));if(destructors!==null){destructors.push(this.rawDestructor,ptr);}}break;default:throwBindingError("Unsupporting sharing policy");}}return ptr}function nonConstNoSmartPtrRawPointerToWireType(destructors,handle){if(handle===null){if(this.isReference){throwBindingError("null is not a valid "+this.name);}return 0}if(!handle.$$){throwBindingError('Cannot pass "'+_embind_repr(handle)+'" as a '+this.name);}if(!handle.$$.ptr){throwBindingError("Cannot pass deleted object as a pointer of type "+this.name);}if(handle.$$.ptrType.isConst){throwBindingError("Cannot convert argument of type "+handle.$$.ptrType.name+" to parameter type "+this.name);}var handleClass=handle.$$.ptrType.registeredClass;var ptr=upcastPointer(handle.$$.ptr,handleClass,this.registeredClass);return ptr}function simpleReadValueFromPointer(pointer){return this["fromWireType"](HEAPU32[pointer>>2])}function RegisteredPointer_getPointee(ptr){if(this.rawGetPointee){ptr=this.rawGetPointee(ptr);}return ptr}function RegisteredPointer_destructor(ptr){if(this.rawDestructor){this.rawDestructor(ptr);}}function RegisteredPointer_deleteObject(handle){if(handle!==null){handle["delete"]();}}function downcastPointer(ptr,ptrClass,desiredClass){if(ptrClass===desiredClass){return ptr}if(undefined===desiredClass.baseClass){return null}var rv=downcastPointer(ptr,ptrClass,desiredClass.baseClass);if(rv===null){return null}return desiredClass.downcast(rv)}function getInheritedInstanceCount(){return Object.keys(registeredInstances).length}function getLiveInheritedInstances(){var rv=[];for(var k in registeredInstances){if(registeredInstances.hasOwnProperty(k)){rv.push(registeredInstances[k]);}}return rv}function setDelayFunction(fn){delayFunction=fn;if(deletionQueue.length&&delayFunction){delayFunction(flushPendingDeletes);}}function init_embind(){Module["getInheritedInstanceCount"]=getInheritedInstanceCount;Module["getLiveInheritedInstances"]=getLiveInheritedInstances;Module["flushPendingDeletes"]=flushPendingDeletes;Module["setDelayFunction"]=setDelayFunction;}var registeredInstances={};function getBasestPointer(class_,ptr){if(ptr===undefined){throwBindingError("ptr should not be undefined");}while(class_.baseClass){ptr=class_.upcast(ptr);class_=class_.baseClass;}return ptr}function getInheritedInstance(class_,ptr){ptr=getBasestPointer(class_,ptr);return registeredInstances[ptr]}function makeClassHandle(prototype,record){if(!record.ptrType||!record.ptr){throwInternalError("makeClassHandle requires ptr and ptrType");}var hasSmartPtrType=!!record.smartPtrType;var hasSmartPtr=!!record.smartPtr;if(hasSmartPtrType!==hasSmartPtr){throwInternalError("Both smartPtrType and smartPtr must be specified");}record.count={value:1};return attachFinalizer(Object.create(prototype,{$$:{value:record}}))}function RegisteredPointer_fromWireType(ptr){var rawPointer=this.getPointee(ptr);if(!rawPointer){this.destructor(ptr);return null}var registeredInstance=getInheritedInstance(this.registeredClass,rawPointer);if(undefined!==registeredInstance){if(0===registeredInstance.$$.count.value){registeredInstance.$$.ptr=rawPointer;registeredInstance.$$.smartPtr=ptr;return registeredInstance["clone"]()}else {var rv=registeredInstance["clone"]();this.destructor(ptr);return rv}}function makeDefaultHandle(){if(this.isSmartPointer){return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this.pointeeType,ptr:rawPointer,smartPtrType:this,smartPtr:ptr})}else {return makeClassHandle(this.registeredClass.instancePrototype,{ptrType:this,ptr:ptr})}}var actualType=this.registeredClass.getActualType(rawPointer);var registeredPointerRecord=registeredPointers[actualType];if(!registeredPointerRecord){return makeDefaultHandle.call(this)}var toType;if(this.isConst){toType=registeredPointerRecord.constPointerType;}else {toType=registeredPointerRecord.pointerType;}var dp=downcastPointer(rawPointer,this.registeredClass,toType.registeredClass);if(dp===null){return makeDefaultHandle.call(this)}if(this.isSmartPointer){return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp,smartPtrType:this,smartPtr:ptr})}else {return makeClassHandle(toType.registeredClass.instancePrototype,{ptrType:toType,ptr:dp})}}function init_RegisteredPointer(){RegisteredPointer.prototype.getPointee=RegisteredPointer_getPointee;RegisteredPointer.prototype.destructor=RegisteredPointer_destructor;RegisteredPointer.prototype["argPackAdvance"]=8;RegisteredPointer.prototype["readValueFromPointer"]=simpleReadValueFromPointer;RegisteredPointer.prototype["deleteObject"]=RegisteredPointer_deleteObject;RegisteredPointer.prototype["fromWireType"]=RegisteredPointer_fromWireType;}function RegisteredPointer(name,registeredClass,isReference,isConst,isSmartPointer,pointeeType,sharingPolicy,rawGetPointee,rawConstructor,rawShare,rawDestructor){this.name=name;this.registeredClass=registeredClass;this.isReference=isReference;this.isConst=isConst;this.isSmartPointer=isSmartPointer;this.pointeeType=pointeeType;this.sharingPolicy=sharingPolicy;this.rawGetPointee=rawGetPointee;this.rawConstructor=rawConstructor;this.rawShare=rawShare;this.rawDestructor=rawDestructor;if(!isSmartPointer&&registeredClass.baseClass===undefined){if(isConst){this["toWireType"]=constNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}else {this["toWireType"]=nonConstNoSmartPtrRawPointerToWireType;this.destructorFunction=null;}}else {this["toWireType"]=genericPointerToWireType;}}function replacePublicSymbol(name,value,numArguments){if(!Module.hasOwnProperty(name)){throwInternalError("Replacing nonexistant public symbol");}if(undefined!==Module[name].overloadTable&&undefined!==numArguments){Module[name].overloadTable[numArguments]=value;}else {Module[name]=value;Module[name].argCount=numArguments;}}function dynCallLegacy(sig,ptr,args){var f=Module["dynCall_"+sig];return args&&args.length?f.apply(null,[ptr].concat(args)):f.call(null,ptr)}function dynCall(sig,ptr,args){if(sig.includes("j")){return dynCallLegacy(sig,ptr,args)}return wasmTable.get(ptr).apply(null,args)}function getDynCaller(sig,ptr){var argCache=[];return function(){argCache.length=arguments.length;for(var i=0;i<arguments.length;i++){argCache[i]=arguments[i];}return dynCall(sig,ptr,argCache)}}function embind__requireFunction(signature,rawFunction){signature=readLatin1String(signature);function makeDynCaller(){if(signature.includes("j")){return getDynCaller(signature,rawFunction)}return wasmTable.get(rawFunction)}var fp=makeDynCaller();if(typeof fp!=="function"){throwBindingError("unknown function pointer with signature "+signature+": "+rawFunction);}return fp}var UnboundTypeError=undefined;function getTypeName(type){var ptr=___getTypeName(type);var rv=readLatin1String(ptr);_free(ptr);return rv}function throwUnboundTypeError(message,types){var unboundTypes=[];var seen={};function visit(type){if(seen[type]){return}if(registeredTypes[type]){return}if(typeDependencies[type]){typeDependencies[type].forEach(visit);return}unboundTypes.push(type);seen[type]=true;}types.forEach(visit);throw new UnboundTypeError(message+": "+unboundTypes.map(getTypeName).join([", "]))}function __embind_register_class(rawType,rawPointerType,rawConstPointerType,baseClassRawType,getActualTypeSignature,getActualType,upcastSignature,upcast,downcastSignature,downcast,name,destructorSignature,rawDestructor){name=readLatin1String(name);getActualType=embind__requireFunction(getActualTypeSignature,getActualType);if(upcast){upcast=embind__requireFunction(upcastSignature,upcast);}if(downcast){downcast=embind__requireFunction(downcastSignature,downcast);}rawDestructor=embind__requireFunction(destructorSignature,rawDestructor);var legalFunctionName=makeLegalFunctionName(name);exposePublicSymbol(legalFunctionName,function(){throwUnboundTypeError("Cannot construct "+name+" due to unbound types",[baseClassRawType]);});whenDependentTypesAreResolved([rawType,rawPointerType,rawConstPointerType],baseClassRawType?[baseClassRawType]:[],function(base){base=base[0];var baseClass;var basePrototype;if(baseClassRawType){baseClass=base.registeredClass;basePrototype=baseClass.instancePrototype;}else {basePrototype=ClassHandle.prototype;}var constructor=createNamedFunction(legalFunctionName,function(){if(Object.getPrototypeOf(this)!==instancePrototype){throw new BindingError("Use 'new' to construct "+name)}if(undefined===registeredClass.constructor_body){throw new BindingError(name+" has no accessible constructor")}var body=registeredClass.constructor_body[arguments.length];if(undefined===body){throw new BindingError("Tried to invoke ctor of "+name+" with invalid number of parameters ("+arguments.length+") - expected ("+Object.keys(registeredClass.constructor_body).toString()+") parameters instead!")}return body.apply(this,arguments)});var instancePrototype=Object.create(basePrototype,{constructor:{value:constructor}});constructor.prototype=instancePrototype;var registeredClass=new RegisteredClass(name,constructor,instancePrototype,rawDestructor,baseClass,getActualType,upcast,downcast);var referenceConverter=new RegisteredPointer(name,registeredClass,true,false,false);var pointerConverter=new RegisteredPointer(name+"*",registeredClass,false,false,false);var constPointerConverter=new RegisteredPointer(name+" const*",registeredClass,false,true,false);registeredPointers[rawType]={pointerType:pointerConverter,constPointerType:constPointerConverter};replacePublicSymbol(legalFunctionName,constructor);return [referenceConverter,pointerConverter,constPointerConverter]});}function heap32VectorToArray(count,firstElement){var array=[];for(var i=0;i<count;i++){array.push(HEAP32[(firstElement>>2)+i]);}return array}function runDestructors(destructors){while(destructors.length){var ptr=destructors.pop();var del=destructors.pop();del(ptr);}}function __embind_register_class_constructor(rawClassType,argCount,rawArgTypesAddr,invokerSignature,invoker,rawConstructor){assert(argCount>0);var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);invoker=embind__requireFunction(invokerSignature,invoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName="constructor "+classType.name;if(undefined===classType.registeredClass.constructor_body){classType.registeredClass.constructor_body=[];}if(undefined!==classType.registeredClass.constructor_body[argCount-1]){throw new BindingError("Cannot register multiple constructors with identical number of parameters ("+(argCount-1)+") for class '"+classType.name+"'! Overload resolution is currently only performed using the parameter count, not actual type info!")}classType.registeredClass.constructor_body[argCount-1]=function unboundTypeHandler(){throwUnboundTypeError("Cannot construct "+classType.name+" due to unbound types",rawArgTypes);};whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){argTypes.splice(1,0,null);classType.registeredClass.constructor_body[argCount-1]=craftInvokerFunction(humanName,argTypes,null,invoker,rawConstructor);return []});return []});}function craftInvokerFunction(humanName,argTypes,classType,cppInvokerFunc,cppTargetFunc){var argCount=argTypes.length;if(argCount<2){throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");}var isClassMethodFunc=argTypes[1]!==null&&classType!==null;var needsDestructorStack=false;for(var i=1;i<argTypes.length;++i){if(argTypes[i]!==null&&argTypes[i].destructorFunction===undefined){needsDestructorStack=true;break}}var returns=argTypes[0].name!=="void";var expectedArgCount=argCount-2;var argsWired=new Array(expectedArgCount);var invokerFuncArgs=[];var destructors=[];return function(){if(arguments.length!==expectedArgCount){throwBindingError("function "+humanName+" called with "+arguments.length+" arguments, expected "+expectedArgCount+" args!");}destructors.length=0;var thisWired;invokerFuncArgs.length=isClassMethodFunc?2:1;invokerFuncArgs[0]=cppTargetFunc;if(isClassMethodFunc){thisWired=argTypes[1].toWireType(destructors,this);invokerFuncArgs[1]=thisWired;}for(var i=0;i<expectedArgCount;++i){argsWired[i]=argTypes[i+2].toWireType(destructors,arguments[i]);invokerFuncArgs.push(argsWired[i]);}var rv=cppInvokerFunc.apply(null,invokerFuncArgs);function onDone(rv){if(needsDestructorStack){runDestructors(destructors);}else {for(var i=isClassMethodFunc?1:2;i<argTypes.length;i++){var param=i===1?thisWired:argsWired[i-2];if(argTypes[i].destructorFunction!==null){argTypes[i].destructorFunction(param);}}}if(returns){return argTypes[0].fromWireType(rv)}}return onDone(rv)}}function __embind_register_class_function(rawClassType,methodName,argCount,rawArgTypesAddr,invokerSignature,rawInvoker,context,isPureVirtual){var rawArgTypes=heap32VectorToArray(argCount,rawArgTypesAddr);methodName=readLatin1String(methodName);rawInvoker=embind__requireFunction(invokerSignature,rawInvoker);whenDependentTypesAreResolved([],[rawClassType],function(classType){classType=classType[0];var humanName=classType.name+"."+methodName;if(methodName.startsWith("@@")){methodName=Symbol[methodName.substring(2)];}if(isPureVirtual){classType.registeredClass.pureVirtualFunctions.push(methodName);}function unboundTypesHandler(){throwUnboundTypeError("Cannot call "+humanName+" due to unbound types",rawArgTypes);}var proto=classType.registeredClass.instancePrototype;var method=proto[methodName];if(undefined===method||undefined===method.overloadTable&&method.className!==classType.name&&method.argCount===argCount-2){unboundTypesHandler.argCount=argCount-2;unboundTypesHandler.className=classType.name;proto[methodName]=unboundTypesHandler;}else {ensureOverloadTable(proto,methodName,humanName);proto[methodName].overloadTable[argCount-2]=unboundTypesHandler;}whenDependentTypesAreResolved([],rawArgTypes,function(argTypes){var memberFunction=craftInvokerFunction(humanName,argTypes,classType,rawInvoker,context);if(undefined===proto[methodName].overloadTable){memberFunction.argCount=argCount-2;proto[methodName]=memberFunction;}else {proto[methodName].overloadTable[argCount-2]=memberFunction;}return []});return []});}var emval_free_list=[];var emval_handle_array=[{},{value:undefined},{value:null},{value:true},{value:false}];function __emval_decref(handle){if(handle>4&&0===--emval_handle_array[handle].refcount){emval_handle_array[handle]=undefined;emval_free_list.push(handle);}}function count_emval_handles(){var count=0;for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){++count;}}return count}function get_first_emval(){for(var i=5;i<emval_handle_array.length;++i){if(emval_handle_array[i]!==undefined){return emval_handle_array[i]}}return null}function init_emval(){Module["count_emval_handles"]=count_emval_handles;Module["get_first_emval"]=get_first_emval;}function __emval_register(value){switch(value){case undefined:{return 1}case null:{return 2}case true:{return 3}case false:{return 4}default:{var handle=emval_free_list.length?emval_free_list.pop():emval_handle_array.length;emval_handle_array[handle]={refcount:1,value:value};return handle}}}function __embind_register_emval(rawType,name){name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(handle){var rv=emval_handle_array[handle].value;__emval_decref(handle);return rv},"toWireType":function(destructors,value){return __emval_register(value)},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:null});}function enumReadValueFromPointer(name,shift,signed){switch(shift){case 0:return function(pointer){var heap=signed?HEAP8:HEAPU8;return this["fromWireType"](heap[pointer])};case 1:return function(pointer){var heap=signed?HEAP16:HEAPU16;return this["fromWireType"](heap[pointer>>1])};case 2:return function(pointer){var heap=signed?HEAP32:HEAPU32;return this["fromWireType"](heap[pointer>>2])};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_enum(rawType,name,size,isSigned){var shift=getShiftFromSize(size);name=readLatin1String(name);function ctor(){}ctor.values={};registerType(rawType,{name:name,constructor:ctor,"fromWireType":function(c){return this.constructor.values[c]},"toWireType":function(destructors,c){return c.value},"argPackAdvance":8,"readValueFromPointer":enumReadValueFromPointer(name,shift,isSigned),destructorFunction:null});exposePublicSymbol(name,ctor);}function requireRegisteredType(rawType,humanName){var impl=registeredTypes[rawType];if(undefined===impl){throwBindingError(humanName+" has unknown type "+getTypeName(rawType));}return impl}function __embind_register_enum_value(rawEnumType,name,enumValue){var enumType=requireRegisteredType(rawEnumType,"enum");name=readLatin1String(name);var Enum=enumType.constructor;var Value=Object.create(enumType.constructor.prototype,{value:{value:enumValue},constructor:{value:createNamedFunction(enumType.name+"_"+name,function(){})}});Enum.values[enumValue]=Value;Enum[name]=Value;}function _embind_repr(v){if(v===null){return "null"}var t=typeof v;if(t==="object"||t==="array"||t==="function"){return v.toString()}else {return ""+v}}function floatReadValueFromPointer(name,shift){switch(shift){case 2:return function(pointer){return this["fromWireType"](HEAPF32[pointer>>2])};case 3:return function(pointer){return this["fromWireType"](HEAPF64[pointer>>3])};default:throw new TypeError("Unknown float type: "+name)}}function __embind_register_float(rawType,name,size){var shift=getShiftFromSize(size);name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":function(value){return value},"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}return value},"argPackAdvance":8,"readValueFromPointer":floatReadValueFromPointer(name,shift),destructorFunction:null});}function integerReadValueFromPointer(name,shift,signed){switch(shift){case 0:return signed?function readS8FromPointer(pointer){return HEAP8[pointer]}:function readU8FromPointer(pointer){return HEAPU8[pointer]};case 1:return signed?function readS16FromPointer(pointer){return HEAP16[pointer>>1]}:function readU16FromPointer(pointer){return HEAPU16[pointer>>1]};case 2:return signed?function readS32FromPointer(pointer){return HEAP32[pointer>>2]}:function readU32FromPointer(pointer){return HEAPU32[pointer>>2]};default:throw new TypeError("Unknown integer type: "+name)}}function __embind_register_integer(primitiveType,name,size,minRange,maxRange){name=readLatin1String(name);if(maxRange===-1){maxRange=4294967295;}var shift=getShiftFromSize(size);var fromWireType=function(value){return value};if(minRange===0){var bitshift=32-8*size;fromWireType=function(value){return value<<bitshift>>>bitshift};}var isUnsignedType=name.includes("unsigned");registerType(primitiveType,{name:name,"fromWireType":fromWireType,"toWireType":function(destructors,value){if(typeof value!=="number"&&typeof value!=="boolean"){throw new TypeError('Cannot convert "'+_embind_repr(value)+'" to '+this.name)}if(value<minRange||value>maxRange){throw new TypeError('Passing a number "'+_embind_repr(value)+'" from JS side to C/C++ side to an argument of type "'+name+'", which is outside the valid range ['+minRange+", "+maxRange+"]!")}return isUnsignedType?value>>>0:value|0},"argPackAdvance":8,"readValueFromPointer":integerReadValueFromPointer(name,shift,minRange!==0),destructorFunction:null});}function __embind_register_memory_view(rawType,dataTypeIndex,name){var typeMapping=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array];var TA=typeMapping[dataTypeIndex];function decodeMemoryView(handle){handle=handle>>2;var heap=HEAPU32;var size=heap[handle];var data=heap[handle+1];return new TA(buffer,data,size)}name=readLatin1String(name);registerType(rawType,{name:name,"fromWireType":decodeMemoryView,"argPackAdvance":8,"readValueFromPointer":decodeMemoryView},{ignoreDuplicateRegistrations:true});}function __embind_register_std_string(rawType,name){name=readLatin1String(name);var stdStringIsUTF8=name==="std::string";registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var str;if(stdStringIsUTF8){var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i;if(i==length||HEAPU8[currentBytePtr]==0){var maxRead=currentBytePtr-decodeStartPtr;var stringSegment=UTF8ToString(decodeStartPtr,maxRead);if(str===undefined){str=stringSegment;}else {str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+1;}}}else {var a=new Array(length);for(var i=0;i<length;++i){a[i]=String.fromCharCode(HEAPU8[value+4+i]);}str=a.join("");}_free(value);return str},"toWireType":function(destructors,value){if(value instanceof ArrayBuffer){value=new Uint8Array(value);}var getLength;var valueIsOfTypeString=typeof value==="string";if(!(valueIsOfTypeString||value instanceof Uint8Array||value instanceof Uint8ClampedArray||value instanceof Int8Array)){throwBindingError("Cannot pass non-string to std::string");}if(stdStringIsUTF8&&valueIsOfTypeString){getLength=function(){return lengthBytesUTF8(value)};}else {getLength=function(){return value.length};}var length=getLength();var ptr=_malloc(4+length+1);HEAPU32[ptr>>2]=length;if(stdStringIsUTF8&&valueIsOfTypeString){stringToUTF8(value,ptr+4,length+1);}else {if(valueIsOfTypeString){for(var i=0;i<length;++i){var charCode=value.charCodeAt(i);if(charCode>255){_free(ptr);throwBindingError("String has UTF-16 code units that do not fit in 8 bits");}HEAPU8[ptr+4+i]=charCode;}}else {for(var i=0;i<length;++i){HEAPU8[ptr+4+i]=value[i];}}}if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_std_wstring(rawType,charSize,name){name=readLatin1String(name);var decodeString,encodeString,getHeap,lengthBytesUTF,shift;if(charSize===2){decodeString=UTF16ToString;encodeString=stringToUTF16;lengthBytesUTF=lengthBytesUTF16;getHeap=function(){return HEAPU16};shift=1;}else if(charSize===4){decodeString=UTF32ToString;encodeString=stringToUTF32;lengthBytesUTF=lengthBytesUTF32;getHeap=function(){return HEAPU32};shift=2;}registerType(rawType,{name:name,"fromWireType":function(value){var length=HEAPU32[value>>2];var HEAP=getHeap();var str;var decodeStartPtr=value+4;for(var i=0;i<=length;++i){var currentBytePtr=value+4+i*charSize;if(i==length||HEAP[currentBytePtr>>shift]==0){var maxReadBytes=currentBytePtr-decodeStartPtr;var stringSegment=decodeString(decodeStartPtr,maxReadBytes);if(str===undefined){str=stringSegment;}else {str+=String.fromCharCode(0);str+=stringSegment;}decodeStartPtr=currentBytePtr+charSize;}}_free(value);return str},"toWireType":function(destructors,value){if(!(typeof value==="string")){throwBindingError("Cannot pass non-string to C++ string type "+name);}var length=lengthBytesUTF(value);var ptr=_malloc(4+length+charSize);HEAPU32[ptr>>2]=length>>shift;encodeString(value,ptr+4,length+charSize);if(destructors!==null){destructors.push(_free,ptr);}return ptr},"argPackAdvance":8,"readValueFromPointer":simpleReadValueFromPointer,destructorFunction:function(ptr){_free(ptr);}});}function __embind_register_void(rawType,name){name=readLatin1String(name);registerType(rawType,{isVoid:true,name:name,"argPackAdvance":0,"fromWireType":function(){return undefined},"toWireType":function(destructors,o){return undefined}});}function __emscripten_throw_longjmp(){throw "longjmp"}function __emval_incref(handle){if(handle>4){emval_handle_array[handle].refcount+=1;}}function __emval_take_value(type,argv){type=requireRegisteredType(type,"_emval_take_value");var v=type["readValueFromPointer"](argv);return __emval_register(v)}function _abort(){abort();}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num);}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=2147483648;if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}var SYSCALLS={mappings:{},buffers:[null,[],[]],printChar:function(stream,curr){var buffer=SYSCALLS.buffers[stream];if(curr===0||curr===10){(stream===1?out:err)(UTF8ArrayToString(buffer,0));buffer.length=0;}else {buffer.push(curr);}},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},get64:function(low,high){return low}};function _fd_write(fd,iov,iovcnt,pnum){var num=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];for(var j=0;j<len;j++){SYSCALLS.printChar(fd,HEAPU8[ptr+j]);}num+=len;}HEAP32[pnum>>2]=num;return 0}function _getTempRet0(){return getTempRet0()}function _gettimeofday(ptr){var now=Date.now();HEAP32[ptr>>2]=now/1e3|0;HEAP32[ptr+4>>2]=now%1e3*1e3|0;return 0}function _setTempRet0(val){setTempRet0(val);}embind_init_charCodes();BindingError=Module["BindingError"]=extendError(Error,"BindingError");InternalError=Module["InternalError"]=extendError(Error,"InternalError");init_ClassHandle();init_RegisteredPointer();init_embind();UnboundTypeError=Module["UnboundTypeError"]=extendError(Error,"UnboundTypeError");init_emval();var asmLibraryArg={"y":__embind_register_bigint,"H":__embind_register_bool,"t":__embind_register_class,"p":__embind_register_class_constructor,"e":__embind_register_class_function,"G":__embind_register_emval,"L":__embind_register_enum,"x":__embind_register_enum_value,"r":__embind_register_float,"h":__embind_register_integer,"g":__embind_register_memory_view,"s":__embind_register_std_string,"m":__embind_register_std_wstring,"I":__embind_register_void,"F":__emscripten_throw_longjmp,"k":__emval_decref,"l":__emval_incref,"j":__emval_take_value,"E":_abort,"C":_emscripten_memcpy_big,"D":_emscripten_resize_heap,"q":_fd_write,"a":_getTempRet0,"f":_gettimeofday,"d":invoke_iii,"n":invoke_iiii,"o":invoke_iiiii,"u":invoke_iiiiii,"K":invoke_iiiiiiiii,"B":invoke_iiiijj,"z":invoke_iij,"i":invoke_vi,"w":invoke_vii,"c":invoke_viiii,"J":invoke_viiiiii,"v":invoke_viiiiiiii,"A":invoke_vijjjid,"b":_setTempRet0};createWasm();Module["___wasm_call_ctors"]=function(){return (Module["___wasm_call_ctors"]=Module["asm"]["N"]).apply(null,arguments)};var _free=Module["_free"]=function(){return (_free=Module["_free"]=Module["asm"]["O"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return (_malloc=Module["_malloc"]=Module["asm"]["P"]).apply(null,arguments)};var ___getTypeName=Module["___getTypeName"]=function(){return (___getTypeName=Module["___getTypeName"]=Module["asm"]["R"]).apply(null,arguments)};Module["___embind_register_native_and_builtin_types"]=function(){return (Module["___embind_register_native_and_builtin_types"]=Module["asm"]["S"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return (stackSave=Module["stackSave"]=Module["asm"]["T"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return (stackRestore=Module["stackRestore"]=Module["asm"]["U"]).apply(null,arguments)};var _setThrew=Module["_setThrew"]=function(){return (_setThrew=Module["_setThrew"]=Module["asm"]["V"]).apply(null,arguments)};var dynCall_iiiijj=Module["dynCall_iiiijj"]=function(){return (dynCall_iiiijj=Module["dynCall_iiiijj"]=Module["asm"]["W"]).apply(null,arguments)};Module["dynCall_iiijiii"]=function(){return (Module["dynCall_iiijiii"]=Module["asm"]["X"]).apply(null,arguments)};var dynCall_vijjjid=Module["dynCall_vijjjid"]=function(){return (dynCall_vijjjid=Module["dynCall_vijjjid"]=Module["asm"]["Y"]).apply(null,arguments)};var dynCall_iij=Module["dynCall_iij"]=function(){return (dynCall_iij=Module["dynCall_iij"]=Module["asm"]["Z"]).apply(null,arguments)};Module["dynCall_jiji"]=function(){return (Module["dynCall_jiji"]=Module["asm"]["_"]).apply(null,arguments)};function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return wasmTable.get(index)(a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_vii(index,a1,a2){var sp=stackSave();try{wasmTable.get(index)(a1,a2);}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_iii(index,a1,a2){var sp=stackSave();try{return wasmTable.get(index)(a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_vi(index,a1){var sp=stackSave();try{wasmTable.get(index)(a1);}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_viiii(index,a1,a2,a3,a4){var sp=stackSave();try{wasmTable.get(index)(a1,a2,a3,a4);}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return wasmTable.get(index)(a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{wasmTable.get(index)(a1,a2,a3,a4,a5,a6,a7,a8);}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_iiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return wasmTable.get(index)(a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{wasmTable.get(index)(a1,a2,a3,a4,a5,a6);}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_iiiijj(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return dynCall_iiiijj(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_vijjjid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{dynCall_vijjjid(index,a1,a2,a3,a4,a5,a6,a7,a8,a9);}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}function invoke_iij(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iij(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0);}}var calledRun;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller;};function run(args){if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();readyPromiseResolve(Module);if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();postRun();}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("");},1);doRun();},1);}else {doRun();}}Module["run"]=run;if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()();}}run();


      return libvpx.ready
    }
    );
    })();
    module.exports = libvpx;
    libvpx.getUrl = function(path) {
        return 'https://st.mycdn.me/static/libvpx/2-0-9/' + path;
    };
    });

    var bitBuffer = createCommonjsModule(function (module) {
    (function (root) {

    /**********************************************************
     *
     * BitView
     *
     * BitView provides a similar interface to the standard
     * DataView, but with support for bit-level reads / writes.
     *
     **********************************************************/
    var BitView = function (source, byteOffset, byteLength) {
    	var isBuffer = source instanceof ArrayBuffer ||
    		(typeof Buffer !== 'undefined' && source instanceof Buffer);

    	if (!isBuffer) {
    		throw new Error('Must specify a valid ArrayBuffer or Buffer.');
    	}

    	byteOffset = byteOffset || 0;
    	byteLength = byteLength || source.byteLength /* ArrayBuffer */ || source.length /* Buffer */;

    	this._view = new Uint8Array(source.buffer || source, byteOffset, byteLength);

    	this.bigEndian = false;
    };

    // Used to massage fp values so we can operate on them
    // at the bit level.
    BitView._scratch = new DataView(new ArrayBuffer(8));

    Object.defineProperty(BitView.prototype, 'buffer', {
    	get: function () { return typeof Buffer !== 'undefined' ?  Buffer.from(this._view.buffer) : this._view.buffer; },
    	enumerable: true,
    	configurable: false
    });

    Object.defineProperty(BitView.prototype, 'byteLength', {
    	get: function () { return this._view.length; },
    	enumerable: true,
    	configurable: false
    });

    BitView.prototype._setBit = function (offset, on) {
    	if (on) {
    		this._view[offset >> 3] |= 1 << (offset & 7);
    	} else {
    		this._view[offset >> 3] &= ~(1 << (offset & 7));
    	}
    };

    BitView.prototype.getBits = function (offset, bits, signed) {
    	var available = (this._view.length * 8 - offset);

    	if (bits > available) {
    		throw new Error('Cannot get ' + bits + ' bit(s) from offset ' + offset + ', ' + available + ' available');
    	}

    	var value = 0;
    	for (var i = 0; i < bits;) {
    		var remaining = bits - i;
    		var bitOffset = offset & 7;
    		var currentByte = this._view[offset >> 3];

    		// the max number of bits we can read from the current byte
    		var read = Math.min(remaining, 8 - bitOffset);

    		var mask, readBits;
    		if (this.bigEndian) {
    			// create a mask with the correct bit width
    			mask = ~(0xFF << read);
    			// shift the bits we want to the start of the byte and mask of the rest
    			readBits = (currentByte >> (8 - read - bitOffset)) & mask;

    			value <<= read;
    			value |= readBits;
    		} else {
    			// create a mask with the correct bit width
    			mask = ~(0xFF << read);
    			// shift the bits we want to the start of the byte and mask off the rest
    			readBits = (currentByte >> bitOffset) & mask;

    			value |= readBits << i;
    		}

    		offset += read;
    		i += read;
    	}

    	if (signed) {
    		// If we're not working with a full 32 bits, check the
    		// imaginary MSB for this bit count and convert to a
    		// valid 32-bit signed value if set.
    		if (bits !== 32 && value & (1 << (bits - 1))) {
    			value |= -1 ^ ((1 << bits) - 1);
    		}

    		return value;
    	}

    	return value >>> 0;
    };

    BitView.prototype.setBits = function (offset, value, bits) {
    	var available = (this._view.length * 8 - offset);

    	if (bits > available) {
    		throw new Error('Cannot set ' + bits + ' bit(s) from offset ' + offset + ', ' + available + ' available');
    	}

    	for (var i = 0; i < bits;) {
    		var remaining = bits - i;
    		var bitOffset = offset & 7;
    		var byteOffset = offset >> 3;
    		var wrote = Math.min(remaining, 8 - bitOffset);

    		var mask, writeBits, destMask;
    		if (this.bigEndian) {
    			// create a mask with the correct bit width
    			mask = ~(~0 << wrote);
    			// shift the bits we want to the start of the byte and mask of the rest
    			writeBits = (value >> (bits - i - wrote)) & mask;

    			var destShift = 8 - bitOffset - wrote;
    			// destination mask to zero all the bits we're changing first
    			destMask = ~(mask << destShift);

    			this._view[byteOffset] =
    				(this._view[byteOffset] & destMask)
    				| (writeBits << destShift);

    		} else {
    			// create a mask with the correct bit width
    			mask = ~(0xFF << wrote);
    			// shift the bits we want to the start of the byte and mask of the rest
    			writeBits = value & mask;
    			value >>= wrote;

    			// destination mask to zero all the bits we're changing first
    			destMask = ~(mask << bitOffset);

    			this._view[byteOffset] =
    				(this._view[byteOffset] & destMask)
    				| (writeBits << bitOffset);
    		}

    		offset += wrote;
    		i += wrote;
    	}
    };

    BitView.prototype.getBoolean = function (offset) {
    	return this.getBits(offset, 1, false) !== 0;
    };
    BitView.prototype.getInt8 = function (offset) {
    	return this.getBits(offset, 8, true);
    };
    BitView.prototype.getUint8 = function (offset) {
    	return this.getBits(offset, 8, false);
    };
    BitView.prototype.getInt16 = function (offset) {
    	return this.getBits(offset, 16, true);
    };
    BitView.prototype.getUint16 = function (offset) {
    	return this.getBits(offset, 16, false);
    };
    BitView.prototype.getInt32 = function (offset) {
    	return this.getBits(offset, 32, true);
    };
    BitView.prototype.getUint32 = function (offset) {
    	return this.getBits(offset, 32, false);
    };
    BitView.prototype.getFloat32 = function (offset) {
    	BitView._scratch.setUint32(0, this.getUint32(offset));
    	return BitView._scratch.getFloat32(0);
    };
    BitView.prototype.getFloat64 = function (offset) {
    	BitView._scratch.setUint32(0, this.getUint32(offset));
    	// DataView offset is in bytes.
    	BitView._scratch.setUint32(4, this.getUint32(offset+32));
    	return BitView._scratch.getFloat64(0);
    };

    BitView.prototype.setBoolean = function (offset, value) {
    	this.setBits(offset, value ? 1 : 0, 1);
    };
    BitView.prototype.setInt8  =
    BitView.prototype.setUint8 = function (offset, value) {
    	this.setBits(offset, value, 8);
    };
    BitView.prototype.setInt16  =
    BitView.prototype.setUint16 = function (offset, value) {
    	this.setBits(offset, value, 16);
    };
    BitView.prototype.setInt32  =
    BitView.prototype.setUint32 = function (offset, value) {
    	this.setBits(offset, value, 32);
    };
    BitView.prototype.setFloat32 = function (offset, value) {
    	BitView._scratch.setFloat32(0, value);
    	this.setBits(offset, BitView._scratch.getUint32(0), 32);
    };
    BitView.prototype.setFloat64 = function (offset, value) {
    	BitView._scratch.setFloat64(0, value);
    	this.setBits(offset, BitView._scratch.getUint32(0), 32);
    	this.setBits(offset+32, BitView._scratch.getUint32(4), 32);
    };
    BitView.prototype.getArrayBuffer = function (offset, byteLength) {
    	var buffer = new Uint8Array(byteLength);
    	for (var i = 0; i < byteLength; i++) {
    		buffer[i] = this.getUint8(offset + (i * 8));
    	}
    	return buffer;
    };

    /**********************************************************
     *
     * BitStream
     *
     * Small wrapper for a BitView to maintain your position,
     * as well as to handle reading / writing of string data
     * to the underlying buffer.
     *
     **********************************************************/
    var reader = function (name, size) {
    	return function () {
    		if (this._index + size > this._length) {
    			throw new Error('Trying to read past the end of the stream');
    		}
    		var val = this._view[name](this._index);
    		this._index += size;
    		return val;
    	};
    };

    var writer = function (name, size) {
    	return function (value) {
    		this._view[name](this._index, value);
    		this._index += size;
    	};
    };

    function readASCIIString(stream, bytes) {
    	return readString(stream, bytes, false);
    }

    function readUTF8String(stream, bytes) {
    	return readString(stream, bytes, true);
    }

    function readString(stream, bytes, utf8) {
    	if (bytes === 0) {
    		return '';
    	}
    	var i = 0;
    	var chars = [];
    	var append = true;
    	var fixedLength = !!bytes;
    	if (!bytes) {
    		bytes = Math.floor((stream._length - stream._index) / 8);
    	}

    	// Read while we still have space available, or until we've
    	// hit the fixed byte length passed in.
    	while (i < bytes) {
    		var c = stream.readUint8();

    		// Stop appending chars once we hit 0x00
    		if (c === 0x00) {
    			append = false;

    			// If we don't have a fixed length to read, break out now.
    			if (!fixedLength) {
    				break;
    			}
    		}
    		if (append) {
    			chars.push(c);
    		}

    		i++;
    	}

    	var string = String.fromCharCode.apply(null, chars);
    	if (utf8) {
    		try {
    			return decodeURIComponent(escape(string)); // https://stackoverflow.com/a/17192845
    		} catch (e) {
    			return string;
    		}
    	} else {
    		return string;
    	}
    }

    function writeASCIIString(stream, string, bytes) {
    	var length = bytes || string.length + 1;  // + 1 for NULL

    	for (var i = 0; i < length; i++) {
    		stream.writeUint8(i < string.length ? string.charCodeAt(i) : 0x00);
    	}
    }

    function writeUTF8String(stream, string, bytes) {
    	var byteArray = stringToByteArray(string);

    	var length = bytes || byteArray.length + 1;  // + 1 for NULL
    	for (var i = 0; i < length; i++) {
    		stream.writeUint8(i < byteArray.length ? byteArray[i] : 0x00);
    	}
    }

    function stringToByteArray(str) { // https://gist.github.com/volodymyr-mykhailyk/2923227
    	var b = [], i, unicode;
    	for (i = 0; i < str.length; i++) {
    		unicode = str.charCodeAt(i);
    		// 0x00000000 - 0x0000007f -> 0xxxxxxx
    		if (unicode <= 0x7f) {
    			b.push(unicode);
    			// 0x00000080 - 0x000007ff -> 110xxxxx 10xxxxxx
    		} else if (unicode <= 0x7ff) {
    			b.push((unicode >> 6) | 0xc0);
    			b.push((unicode & 0x3F) | 0x80);
    			// 0x00000800 - 0x0000ffff -> 1110xxxx 10xxxxxx 10xxxxxx
    		} else if (unicode <= 0xffff) {
    			b.push((unicode >> 12) | 0xe0);
    			b.push(((unicode >> 6) & 0x3f) | 0x80);
    			b.push((unicode & 0x3f) | 0x80);
    			// 0x00010000 - 0x001fffff -> 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
    		} else {
    			b.push((unicode >> 18) | 0xf0);
    			b.push(((unicode >> 12) & 0x3f) | 0x80);
    			b.push(((unicode >> 6) & 0x3f) | 0x80);
    			b.push((unicode & 0x3f) | 0x80);
    		}
    	}

    	return b;
    }

    var BitStream = function (source, byteOffset, byteLength) {
    	var isBuffer = source instanceof ArrayBuffer ||
    		(typeof Buffer !== 'undefined' && source instanceof Buffer);

    	if (!(source instanceof BitView) && !isBuffer) {
    		throw new Error('Must specify a valid BitView, ArrayBuffer or Buffer');
    	}

    	if (isBuffer) {
    		this._view = new BitView(source, byteOffset, byteLength);
    	} else {
    		this._view = source;
    	}

    	this._index = 0;
    	this._startIndex = 0;
    	this._length = this._view.byteLength * 8;
    };

    Object.defineProperty(BitStream.prototype, 'index', {
    	get: function () { return this._index - this._startIndex; },
    	set: function (val) { this._index = val + this._startIndex; },
    	enumerable: true,
    	configurable: true
    });

    Object.defineProperty(BitStream.prototype, 'length', {
    	get: function () { return this._length - this._startIndex; },
    	set: function (val) { this._length = val + this._startIndex; },
    	enumerable  : true,
    	configurable: true
    });

    Object.defineProperty(BitStream.prototype, 'bitsLeft', {
    	get: function () { return this._length - this._index; },
    	enumerable  : true,
    	configurable: true
    });

    Object.defineProperty(BitStream.prototype, 'byteIndex', {
    	// Ceil the returned value, over compensating for the amount of
    	// bits written to the stream.
    	get: function () { return Math.ceil(this._index / 8); },
    	set: function (val) { this._index = val * 8; },
    	enumerable: true,
    	configurable: true
    });

    Object.defineProperty(BitStream.prototype, 'buffer', {
    	get: function () { return this._view.buffer; },
    	enumerable: true,
    	configurable: false
    });

    Object.defineProperty(BitStream.prototype, 'view', {
    	get: function () { return this._view; },
    	enumerable: true,
    	configurable: false
    });

    Object.defineProperty(BitStream.prototype, 'bigEndian', {
    	get: function () { return this._view.bigEndian; },
    	set: function (val) { this._view.bigEndian = val; },
    	enumerable: true,
    	configurable: false
    });

    BitStream.prototype.readBits = function (bits, signed) {
    	var val = this._view.getBits(this._index, bits, signed);
    	this._index += bits;
    	return val;
    };

    BitStream.prototype.writeBits = function (value, bits) {
    	this._view.setBits(this._index, value, bits);
    	this._index += bits;
    };

    BitStream.prototype.readBoolean = reader('getBoolean', 1);
    BitStream.prototype.readInt8 = reader('getInt8', 8);
    BitStream.prototype.readUint8 = reader('getUint8', 8);
    BitStream.prototype.readInt16 = reader('getInt16', 16);
    BitStream.prototype.readUint16 = reader('getUint16', 16);
    BitStream.prototype.readInt32 = reader('getInt32', 32);
    BitStream.prototype.readUint32 = reader('getUint32', 32);
    BitStream.prototype.readFloat32 = reader('getFloat32', 32);
    BitStream.prototype.readFloat64 = reader('getFloat64', 64);

    BitStream.prototype.writeBoolean = writer('setBoolean', 1);
    BitStream.prototype.writeInt8 = writer('setInt8', 8);
    BitStream.prototype.writeUint8 = writer('setUint8', 8);
    BitStream.prototype.writeInt16 = writer('setInt16', 16);
    BitStream.prototype.writeUint16 = writer('setUint16', 16);
    BitStream.prototype.writeInt32 = writer('setInt32', 32);
    BitStream.prototype.writeUint32 = writer('setUint32', 32);
    BitStream.prototype.writeFloat32 = writer('setFloat32', 32);
    BitStream.prototype.writeFloat64 = writer('setFloat64', 64);

    BitStream.prototype.readASCIIString = function (bytes) {
    	return readASCIIString(this, bytes);
    };

    BitStream.prototype.readUTF8String = function (bytes) {
    	return readUTF8String(this, bytes);
    };

    BitStream.prototype.writeASCIIString = function (string, bytes) {
    	writeASCIIString(this, string, bytes);
    };

    BitStream.prototype.writeUTF8String = function (string, bytes) {
    	writeUTF8String(this, string, bytes);
    };
    BitStream.prototype.readBitStream = function(bitLength) {
    	var slice = new BitStream(this._view);
    	slice._startIndex = this._index;
    	slice._index = this._index;
    	slice.length = bitLength;
    	this._index += bitLength;
    	return slice;
    };

    BitStream.prototype.writeBitStream = function(stream, length) {
    	if (!length) {
    		length = stream.bitsLeft;
    	}

    	var bitsToWrite;
    	while (length > 0) {
    		bitsToWrite = Math.min(length, 32);
    		this.writeBits(stream.readBits(bitsToWrite), bitsToWrite);
    		length -= bitsToWrite;
    	}
    };

    BitStream.prototype.readArrayBuffer = function(byteLength) {
    	var buffer = this._view.getArrayBuffer(this._index, byteLength);
    	this._index += (byteLength * 8);
    	return buffer;
    };

    BitStream.prototype.writeArrayBuffer = function(buffer, byteLength) {
    	this.writeBitStream(new BitStream(buffer), byteLength * 8);
    };

    // AMD / RequireJS
    if (module.exports) {
    	module.exports = {
    		BitView: BitView,
    		BitStream: BitStream
    	};
    }

    }());
    });

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */
    /** Used as the `TypeError` message for "Functions" methods. */
    var FUNC_ERROR_TEXT = 'Expected a function';

    /** Used to stand-in for `undefined` hash values. */
    var HASH_UNDEFINED = '__lodash_hash_undefined__';

    /** `Object#toString` result references. */
    var funcTag = '[object Function]',
        genTag = '[object GeneratorFunction]';

    /**
     * Used to match `RegExp`
     * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
     */
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

    /** Used to detect host constructors (Safari). */
    var reIsHostCtor = /^\[object .+?Constructor\]$/;

    /** Detect free variable `global` from Node.js. */
    var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

    /** Detect free variable `self`. */
    var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    /** Used as a reference to the global object. */
    var root = freeGlobal || freeSelf || Function('return this')();

    /**
     * Gets the value at `key` of `object`.
     *
     * @private
     * @param {Object} [object] The object to query.
     * @param {string} key The key of the property to get.
     * @returns {*} Returns the property value.
     */
    function getValue(object, key) {
      return object == null ? undefined : object[key];
    }

    /**
     * Checks if `value` is a host object in IE < 9.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
     */
    function isHostObject(value) {
      // Many host objects are `Object` objects that can coerce to strings
      // despite having improperly defined `toString` methods.
      var result = false;
      if (value != null && typeof value.toString != 'function') {
        try {
          result = !!(value + '');
        } catch (e) {}
      }
      return result;
    }

    /** Used for built-in method references. */
    var arrayProto = Array.prototype,
        funcProto = Function.prototype,
        objectProto = Object.prototype;

    /** Used to detect overreaching core-js shims. */
    var coreJsData = root['__core-js_shared__'];

    /** Used to detect methods masquerading as native. */
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
      return uid ? ('Symbol(src)_1.' + uid) : '';
    }());

    /** Used to resolve the decompiled source of functions. */
    var funcToString = funcProto.toString;

    /** Used to check objects for own properties. */
    var hasOwnProperty = objectProto.hasOwnProperty;

    /**
     * Used to resolve the
     * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
     * of values.
     */
    var objectToString = objectProto.toString;

    /** Used to detect if a method is native. */
    var reIsNative = RegExp('^' +
      funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
      .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
    );

    /** Built-in value references. */
    var splice = arrayProto.splice;

    /* Built-in method references that are verified to be native. */
    var Map$2 = getNative(root, 'Map'),
        nativeCreate = getNative(Object, 'create');

    /**
     * Creates a hash object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function Hash(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the hash.
     *
     * @private
     * @name clear
     * @memberOf Hash
     */
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
    }

    /**
     * Removes `key` and its value from the hash.
     *
     * @private
     * @name delete
     * @memberOf Hash
     * @param {Object} hash The hash to modify.
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function hashDelete(key) {
      return this.has(key) && delete this.__data__[key];
    }

    /**
     * Gets the hash value for `key`.
     *
     * @private
     * @name get
     * @memberOf Hash
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? undefined : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : undefined;
    }

    /**
     * Checks if a hash value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf Hash
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
    }

    /**
     * Sets the hash `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf Hash
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the hash instance.
     */
    function hashSet(key, value) {
      var data = this.__data__;
      data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
      return this;
    }

    // Add methods to `Hash`.
    Hash.prototype.clear = hashClear;
    Hash.prototype['delete'] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;

    /**
     * Creates an list cache object.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function ListCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the list cache.
     *
     * @private
     * @name clear
     * @memberOf ListCache
     */
    function listCacheClear() {
      this.__data__ = [];
    }

    /**
     * Removes `key` and its value from the list cache.
     *
     * @private
     * @name delete
     * @memberOf ListCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function listCacheDelete(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      return true;
    }

    /**
     * Gets the list cache value for `key`.
     *
     * @private
     * @name get
     * @memberOf ListCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function listCacheGet(key) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      return index < 0 ? undefined : data[index][1];
    }

    /**
     * Checks if a list cache value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf ListCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }

    /**
     * Sets the list cache `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf ListCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the list cache instance.
     */
    function listCacheSet(key, value) {
      var data = this.__data__,
          index = assocIndexOf(data, key);

      if (index < 0) {
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }

    // Add methods to `ListCache`.
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype['delete'] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;

    /**
     * Creates a map cache object to store key-value pairs.
     *
     * @private
     * @constructor
     * @param {Array} [entries] The key-value pairs to cache.
     */
    function MapCache(entries) {
      var index = -1,
          length = entries ? entries.length : 0;

      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }

    /**
     * Removes all key-value entries from the map.
     *
     * @private
     * @name clear
     * @memberOf MapCache
     */
    function mapCacheClear() {
      this.__data__ = {
        'hash': new Hash,
        'map': new (Map$2 || ListCache),
        'string': new Hash
      };
    }

    /**
     * Removes `key` and its value from the map.
     *
     * @private
     * @name delete
     * @memberOf MapCache
     * @param {string} key The key of the value to remove.
     * @returns {boolean} Returns `true` if the entry was removed, else `false`.
     */
    function mapCacheDelete(key) {
      return getMapData(this, key)['delete'](key);
    }

    /**
     * Gets the map value for `key`.
     *
     * @private
     * @name get
     * @memberOf MapCache
     * @param {string} key The key of the value to get.
     * @returns {*} Returns the entry value.
     */
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }

    /**
     * Checks if a map value for `key` exists.
     *
     * @private
     * @name has
     * @memberOf MapCache
     * @param {string} key The key of the entry to check.
     * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
     */
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }

    /**
     * Sets the map `key` to `value`.
     *
     * @private
     * @name set
     * @memberOf MapCache
     * @param {string} key The key of the value to set.
     * @param {*} value The value to set.
     * @returns {Object} Returns the map cache instance.
     */
    function mapCacheSet(key, value) {
      getMapData(this, key).set(key, value);
      return this;
    }

    // Add methods to `MapCache`.
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype['delete'] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;

    /**
     * Gets the index at which the `key` is found in `array` of key-value pairs.
     *
     * @private
     * @param {Array} array The array to inspect.
     * @param {*} key The key to search for.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.isNative` without bad shim checks.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a native function,
     *  else `false`.
     */
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }

    /**
     * Gets the data for `map`.
     *
     * @private
     * @param {Object} map The map to query.
     * @param {string} key The reference key.
     * @returns {*} Returns the map data.
     */
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key)
        ? data[typeof key == 'string' ? 'string' : 'hash']
        : data.map;
    }

    /**
     * Gets the native function at `key` of `object`.
     *
     * @private
     * @param {Object} object The object to query.
     * @param {string} key The key of the method to get.
     * @returns {*} Returns the function if it's native, else `undefined`.
     */
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : undefined;
    }

    /**
     * Checks if `value` is suitable for use as unique object key.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
     */
    function isKeyable(value) {
      var type = typeof value;
      return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
        ? (value !== '__proto__')
        : (value === null);
    }

    /**
     * Checks if `func` has its source masked.
     *
     * @private
     * @param {Function} func The function to check.
     * @returns {boolean} Returns `true` if `func` is masked, else `false`.
     */
    function isMasked(func) {
      return !!maskSrcKey && (maskSrcKey in func);
    }

    /**
     * Converts `func` to its source code.
     *
     * @private
     * @param {Function} func The function to process.
     * @returns {string} Returns the source code.
     */
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {}
        try {
          return (func + '');
        } catch (e) {}
      }
      return '';
    }

    /**
     * Creates a function that memoizes the result of `func`. If `resolver` is
     * provided, it determines the cache key for storing the result based on the
     * arguments provided to the memoized function. By default, the first argument
     * provided to the memoized function is used as the map cache key. The `func`
     * is invoked with the `this` binding of the memoized function.
     *
     * **Note:** The cache is exposed as the `cache` property on the memoized
     * function. Its creation may be customized by replacing the `_.memoize.Cache`
     * constructor with one whose instances implement the
     * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
     * method interface of `delete`, `get`, `has`, and `set`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Function
     * @param {Function} func The function to have its output memoized.
     * @param {Function} [resolver] The function to resolve the cache key.
     * @returns {Function} Returns the new memoized function.
     * @example
     *
     * var object = { 'a': 1, 'b': 2 };
     * var other = { 'c': 3, 'd': 4 };
     *
     * var values = _.memoize(_.values);
     * values(object);
     * // => [1, 2]
     *
     * values(other);
     * // => [3, 4]
     *
     * object.a = 2;
     * values(object);
     * // => [1, 2]
     *
     * // Modify the result cache.
     * values.cache.set(object, ['a', 'b']);
     * values(object);
     * // => ['a', 'b']
     *
     * // Replace `_.memoize.Cache`.
     * _.memoize.Cache = WeakMap;
     */
    function memoize(func, resolver) {
      if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      var memoized = function() {
        var args = arguments,
            key = resolver ? resolver.apply(this, args) : args[0],
            cache = memoized.cache;

        if (cache.has(key)) {
          return cache.get(key);
        }
        var result = func.apply(this, args);
        memoized.cache = cache.set(key, result);
        return result;
      };
      memoized.cache = new (memoize.Cache || MapCache);
      return memoized;
    }

    // Assign cache to `_.memoize`.
    memoize.Cache = MapCache;

    /**
     * Performs a
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * comparison between two values to determine if they are equivalent.
     *
     * @static
     * @memberOf _
     * @since 4.0.0
     * @category Lang
     * @param {*} value The value to compare.
     * @param {*} other The other value to compare.
     * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
     * @example
     *
     * var object = { 'a': 1 };
     * var other = { 'a': 1 };
     *
     * _.eq(object, object);
     * // => true
     *
     * _.eq(object, other);
     * // => false
     *
     * _.eq('a', 'a');
     * // => true
     *
     * _.eq('a', Object('a'));
     * // => false
     *
     * _.eq(NaN, NaN);
     * // => true
     */
    function eq(value, other) {
      return value === other || (value !== value && other !== other);
    }

    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * _.isFunction(_);
     * // => true
     *
     * _.isFunction(/abc/);
     * // => false
     */
    function isFunction(value) {
      // The use of `Object#toString` avoids issues with the `typeof` operator
      // in Safari 8-9 which returns 'object' for typed array and other constructors.
      var tag = isObject(value) ? objectToString.call(value) : '';
      return tag == funcTag || tag == genTag;
    }

    /**
     * Checks if `value` is the
     * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
     * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is an object, else `false`.
     * @example
     *
     * _.isObject({});
     * // => true
     *
     * _.isObject([1, 2, 3]);
     * // => true
     *
     * _.isObject(_.noop);
     * // => true
     *
     * _.isObject(null);
     * // => false
     */
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }

    var lodash_memoize = memoize;

    var numberToByteArray = function (num, byteLength) {
        if (byteLength === void 0) { byteLength = getNumberByteLength(num); }
        var byteArray;
        if (byteLength === 1) {
            byteArray = new DataView(new ArrayBuffer(1));
            byteArray.setUint8(0, num);
        }
        else if (byteLength === 2) {
            byteArray = new DataView(new ArrayBuffer(2));
            byteArray.setUint16(0, num);
        }
        else if (byteLength === 3) {
            byteArray = new DataView(new ArrayBuffer(3));
            byteArray.setUint8(0, num >> 16);
            byteArray.setUint16(1, num & 0xffff);
        }
        else if (byteLength === 4) {
            byteArray = new DataView(new ArrayBuffer(4));
            byteArray.setUint32(0, num);
        }
        else if (num < 0xffffffff) {
            // 4GB (upper limit for int32) should be enough in most cases
            byteArray = new DataView(new ArrayBuffer(5));
            byteArray.setUint32(1, num);
        }
        else if (byteLength === 5) {
            // Naive emulations of int64 bitwise opreators
            byteArray = new DataView(new ArrayBuffer(5));
            byteArray.setUint8(0, num / 0x100000000 | 0);
            byteArray.setUint32(1, num % 0x100000000);
        }
        else if (byteLength === 6) {
            byteArray = new DataView(new ArrayBuffer(6));
            byteArray.setUint16(0, num / 0x100000000 | 0);
            byteArray.setUint32(2, num % 0x100000000);
        }
        else if (byteLength === 7) {
            byteArray = new DataView(new ArrayBuffer(7));
            byteArray.setUint8(0, num / 0x1000000000000 | 0);
            byteArray.setUint16(1, num / 0x100000000 & 0xffff);
            byteArray.setUint32(3, num % 0x100000000);
        }
        else if (byteLength === 8) {
            byteArray = new DataView(new ArrayBuffer(8));
            byteArray.setUint32(0, num / 0x100000000 | 0);
            byteArray.setUint32(4, num % 0x100000000);
        }
        else {
            throw new Error("EBML.typedArrayUtils.numberToByteArray: byte length must be less than or equal to 8");
        }
        return new Uint8Array(byteArray.buffer);
    };
    var stringToByteArray = lodash_memoize(function (str) {
        return Uint8Array.from(Array.from(str).map(function (_) { return _.codePointAt(0); }));
    });
    function getNumberByteLength(num) {
        if (num < 0) {
            throw new Error("EBML.typedArrayUtils.getNumberByteLength: negative number not implemented");
        }
        else if (num < 0x100) {
            return 1;
        }
        else if (num < 0x10000) {
            return 2;
        }
        else if (num < 0x1000000) {
            return 3;
        }
        else if (num < 0x100000000) {
            return 4;
        }
        else if (num < 0x10000000000) {
            return 5;
        }
        else if (num < 0x1000000000000) {
            return 6;
        }
        else if (num < 0x20000000000000) {
            return 7;
        }
        else {
            throw new Error("EBML.typedArrayUtils.getNumberByteLength: number exceeds Number.MAX_SAFE_INTEGER");
        }
    }
    var getNumberByteLength_1 = getNumberByteLength;
    var int16Bit = lodash_memoize(function (num) {
        var ab = new ArrayBuffer(2);
        new DataView(ab).setInt16(0, num);
        return new Uint8Array(ab);
    });
    var float32bit = lodash_memoize(function (num) {
        var ab = new ArrayBuffer(4);
        new DataView(ab).setFloat32(0, num);
        return new Uint8Array(ab);
    });
    var dumpBytes = function (b) {
        return Array.from(new Uint8Array(b)).map(function (_) { return "0x" + _.toString(16); }).join(", ");
    };

    var typedArrayUtils = {
    	numberToByteArray: numberToByteArray,
    	stringToByteArray: stringToByteArray,
    	getNumberByteLength: getNumberByteLength_1,
    	int16Bit: int16Bit,
    	float32bit: float32bit,
    	dumpBytes: dumpBytes
    };

    var ebml = createCommonjsModule(function (module, exports) {


    var Value = (function () {
        function Value(bytes) {
            this.bytes = bytes;
        }
        Value.prototype.write = function (buf, pos) {
            buf.set(this.bytes, pos);
            return pos + this.bytes.length;
        };
        Value.prototype.countSize = function () {
            return this.bytes.length;
        };
        return Value;
    }());
    exports.Value = Value;
    var Element = (function () {
        function Element(id, children, isSizeUnknown) {
            this.id = id;
            this.children = children;
            var bodySize = this.children.reduce(function (p, c) { return p + c.countSize(); }, 0);
            this.sizeMetaData = isSizeUnknown ?
                exports.UNKNOWN_SIZE :
                exports.vintEncode(typedArrayUtils.numberToByteArray(bodySize, exports.getEBMLByteLength(bodySize)));
            this.size = this.id.length + this.sizeMetaData.length + bodySize;
        }
        Element.prototype.write = function (buf, pos) {
            buf.set(this.id, pos);
            buf.set(this.sizeMetaData, pos + this.id.length);
            return this.children.reduce(function (p, c) { return c.write(buf, p); }, pos + this.id.length + this.sizeMetaData.length);
        };
        Element.prototype.countSize = function () {
            return this.size;
        };
        return Element;
    }());
    exports.Element = Element;
    exports.bytes = lodash_memoize(function (data) {
        return new Value(data);
    });
    exports.number = lodash_memoize(function (num) {
        return exports.bytes(typedArrayUtils.numberToByteArray(num));
    });
    exports.vintEncodedNumber = lodash_memoize(function (num) {
        return exports.bytes(exports.vintEncode(typedArrayUtils.numberToByteArray(num, exports.getEBMLByteLength(num))));
    });
    exports.string = lodash_memoize(function (str) {
        return exports.bytes(typedArrayUtils.stringToByteArray(str));
    });
    exports.element = function (id, child) {
        return new Element(id, Array.isArray(child) ? child : [child], false);
    };
    exports.unknownSizeElement = function (id, child) {
        return new Element(id, Array.isArray(child) ? child : [child], true);
    };
    exports.build = function (v) {
        var b = new Uint8Array(v.countSize());
        v.write(b, 0);
        return b;
    };
    exports.getEBMLByteLength = function (num) {
        if (num < 0x7f) {
            return 1;
        }
        else if (num < 0x3fff) {
            return 2;
        }
        else if (num < 0x1fffff) {
            return 3;
        }
        else if (num < 0xfffffff) {
            return 4;
        }
        else if (num < 0x7ffffffff) {
            return 5;
        }
        else if (num < 0x3ffffffffff) {
            return 6;
        }
        else if (num < 0x1ffffffffffff) {
            return 7;
        }
        else if (num < 0x20000000000000) {
            return 8;
        }
        else if (num < 0xffffffffffffff) {
            throw new Error("EBMLgetEBMLByteLength: number exceeds Number.MAX_SAFE_INTEGER");
        }
        else {
            throw new Error("EBMLgetEBMLByteLength: data size must be less than or equal to " + (Math.pow(2, 56) - 2));
        }
    };
    exports.UNKNOWN_SIZE = new Uint8Array([0x01, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]);
    exports.vintEncode = function (byteArray) {
        byteArray[0] = exports.getSizeMask(byteArray.length) | byteArray[0];
        return byteArray;
    };
    exports.getSizeMask = function (byteLength) {
        return 0x80 >> (byteLength - 1);
    };
    });

    /**
     * @see https://www.matroska.org/technical/specs/index.html
     */
    var ID = {
        EBML: Uint8Array.of(0x1A, 0x45, 0xDF, 0xA3),
        EBMLVersion: Uint8Array.of(0x42, 0x86),
        EBMLReadVersion: Uint8Array.of(0x42, 0xF7),
        EBMLMaxIDLength: Uint8Array.of(0x42, 0xF2),
        EBMLMaxSizeLength: Uint8Array.of(0x42, 0xF3),
        DocType: Uint8Array.of(0x42, 0x82),
        DocTypeVersion: Uint8Array.of(0x42, 0x87),
        DocTypeReadVersion: Uint8Array.of(0x42, 0x85),
        Void: Uint8Array.of(0xEC),
        CRC32: Uint8Array.of(0xBF),
        Segment: Uint8Array.of(0x18, 0x53, 0x80, 0x67),
        SeekHead: Uint8Array.of(0x11, 0x4D, 0x9B, 0x74),
        Seek: Uint8Array.of(0x4D, 0xBB),
        SeekID: Uint8Array.of(0x53, 0xAB),
        SeekPosition: Uint8Array.of(0x53, 0xAC),
        Info: Uint8Array.of(0x15, 0x49, 0xA9, 0x66),
        SegmentUID: Uint8Array.of(0x73, 0xA4),
        SegmentFilename: Uint8Array.of(0x73, 0x84),
        PrevUID: Uint8Array.of(0x3C, 0xB9, 0x23),
        PrevFilename: Uint8Array.of(0x3C, 0x83, 0xAB),
        NextUID: Uint8Array.of(0x3E, 0xB9, 0x23),
        NextFilename: Uint8Array.of(0x3E, 0x83, 0xBB),
        SegmentFamily: Uint8Array.of(0x44, 0x44),
        ChapterTranslate: Uint8Array.of(0x69, 0x24),
        ChapterTranslateEditionUID: Uint8Array.of(0x69, 0xFC),
        ChapterTranslateCodec: Uint8Array.of(0x69, 0xBF),
        ChapterTranslateID: Uint8Array.of(0x69, 0xA5),
        TimecodeScale: Uint8Array.of(0x2A, 0xD7, 0xB1),
        Duration: Uint8Array.of(0x44, 0x89),
        DateUTC: Uint8Array.of(0x44, 0x61),
        Title: Uint8Array.of(0x7B, 0xA9),
        MuxingApp: Uint8Array.of(0x4D, 0x80),
        WritingApp: Uint8Array.of(0x57, 0x41),
        Cluster: Uint8Array.of(0x1F, 0x43, 0xB6, 0x75),
        Timecode: Uint8Array.of(0xE7),
        SilentTracks: Uint8Array.of(0x58, 0x54),
        SilentTrackNumber: Uint8Array.of(0x58, 0xD7),
        Position: Uint8Array.of(0xA7),
        PrevSize: Uint8Array.of(0xAB),
        SimpleBlock: Uint8Array.of(0xA3),
        BlockGroup: Uint8Array.of(0xA0),
        Block: Uint8Array.of(0xA1),
        BlockAdditions: Uint8Array.of(0x75, 0xA1),
        BlockMore: Uint8Array.of(0xA6),
        BlockAddID: Uint8Array.of(0xEE),
        BlockAdditional: Uint8Array.of(0xA5),
        BlockDuration: Uint8Array.of(0x9B),
        ReferencePriority: Uint8Array.of(0xFA),
        ReferenceBlock: Uint8Array.of(0xFB),
        CodecState: Uint8Array.of(0xA4),
        DiscardPadding: Uint8Array.of(0x75, 0xA2),
        Slices: Uint8Array.of(0x8E),
        TimeSlice: Uint8Array.of(0xE8),
        LaceNumber: Uint8Array.of(0xCC),
        Tracks: Uint8Array.of(0x16, 0x54, 0xAE, 0x6B),
        TrackEntry: Uint8Array.of(0xAE),
        TrackNumber: Uint8Array.of(0xD7),
        TrackUID: Uint8Array.of(0x73, 0xC5),
        TrackType: Uint8Array.of(0x83),
        FlagEnabled: Uint8Array.of(0xB9),
        FlagDefault: Uint8Array.of(0x88),
        FlagForced: Uint8Array.of(0x55, 0xAA),
        FlagLacing: Uint8Array.of(0x9C),
        MinCache: Uint8Array.of(0x6D, 0xE7),
        MaxCache: Uint8Array.of(0x6D, 0xF8),
        DefaultDuration: Uint8Array.of(0x23, 0xE3, 0x83),
        DefaultDecodedFieldDuration: Uint8Array.of(0x23, 0x4E, 0x7A),
        MaxBlockAdditionID: Uint8Array.of(0x55, 0xEE),
        Name: Uint8Array.of(0x53, 0x6E),
        Language: Uint8Array.of(0x22, 0xB5, 0x9C),
        CodecID: Uint8Array.of(0x86),
        CodecPrivate: Uint8Array.of(0x63, 0xA2),
        CodecName: Uint8Array.of(0x25, 0x86, 0x88),
        AttachmentLink: Uint8Array.of(0x74, 0x46),
        CodecDecodeAll: Uint8Array.of(0xAA),
        TrackOverlay: Uint8Array.of(0x6F, 0xAB),
        CodecDelay: Uint8Array.of(0x56, 0xAA),
        SeekPreRoll: Uint8Array.of(0x56, 0xBB),
        TrackTranslate: Uint8Array.of(0x66, 0x24),
        TrackTranslateEditionUID: Uint8Array.of(0x66, 0xFC),
        TrackTranslateCodec: Uint8Array.of(0x66, 0xBF),
        TrackTranslateTrackID: Uint8Array.of(0x66, 0xA5),
        Video: Uint8Array.of(0xE0),
        FlagInterlaced: Uint8Array.of(0x9A),
        FieldOrder: Uint8Array.of(0x9D),
        StereoMode: Uint8Array.of(0x53, 0xB8),
        AlphaMode: Uint8Array.of(0x53, 0xC0),
        PixelWidth: Uint8Array.of(0xB0),
        PixelHeight: Uint8Array.of(0xBA),
        PixelCropBottom: Uint8Array.of(0x54, 0xAA),
        PixelCropTop: Uint8Array.of(0x54, 0xBB),
        PixelCropLeft: Uint8Array.of(0x54, 0xCC),
        PixelCropRight: Uint8Array.of(0x54, 0xDD),
        DisplayWidth: Uint8Array.of(0x54, 0xB0),
        DisplayHeight: Uint8Array.of(0x54, 0xBA),
        DisplayUnit: Uint8Array.of(0x54, 0xB2),
        AspectRatioType: Uint8Array.of(0x54, 0xB3),
        ColourSpace: Uint8Array.of(0x2E, 0xB5, 0x24),
        Colour: Uint8Array.of(0x55, 0xB0),
        MatrixCoefficients: Uint8Array.of(0x55, 0xB1),
        BitsPerChannel: Uint8Array.of(0x55, 0xB2),
        ChromaSubsamplingHorz: Uint8Array.of(0x55, 0xB3),
        ChromaSubsamplingVert: Uint8Array.of(0x55, 0xB4),
        CbSubsamplingHorz: Uint8Array.of(0x55, 0xB5),
        CbSubsamplingVert: Uint8Array.of(0x55, 0xB6),
        ChromaSitingHorz: Uint8Array.of(0x55, 0xB7),
        ChromaSitingVert: Uint8Array.of(0x55, 0xB8),
        Range: Uint8Array.of(0x55, 0xB9),
        TransferCharacteristics: Uint8Array.of(0x55, 0xBA),
        Primaries: Uint8Array.of(0x55, 0xBB),
        MaxCLL: Uint8Array.of(0x55, 0xBC),
        MaxFALL: Uint8Array.of(0x55, 0xBD),
        MasteringMetadata: Uint8Array.of(0x55, 0xD0),
        PrimaryRChromaticityX: Uint8Array.of(0x55, 0xD1),
        PrimaryRChromaticityY: Uint8Array.of(0x55, 0xD2),
        PrimaryGChromaticityX: Uint8Array.of(0x55, 0xD3),
        PrimaryGChromaticityY: Uint8Array.of(0x55, 0xD4),
        PrimaryBChromaticityX: Uint8Array.of(0x55, 0xD5),
        PrimaryBChromaticityY: Uint8Array.of(0x55, 0xD6),
        WhitePointChromaticityX: Uint8Array.of(0x55, 0xD7),
        WhitePointChromaticityY: Uint8Array.of(0x55, 0xD8),
        LuminanceMax: Uint8Array.of(0x55, 0xD9),
        LuminanceMin: Uint8Array.of(0x55, 0xDA),
        Audio: Uint8Array.of(0xE1),
        SamplingFrequency: Uint8Array.of(0xB5),
        OutputSamplingFrequency: Uint8Array.of(0x78, 0xB5),
        Channels: Uint8Array.of(0x9F),
        BitDepth: Uint8Array.of(0x62, 0x64),
        TrackOperation: Uint8Array.of(0xE2),
        TrackCombinePlanes: Uint8Array.of(0xE3),
        TrackPlane: Uint8Array.of(0xE4),
        TrackPlaneUID: Uint8Array.of(0xE5),
        TrackPlaneType: Uint8Array.of(0xE6),
        TrackJoinBlocks: Uint8Array.of(0xE9),
        TrackJoinUID: Uint8Array.of(0xED),
        ContentEncodings: Uint8Array.of(0x6D, 0x80),
        ContentEncoding: Uint8Array.of(0x62, 0x40),
        ContentEncodingOrder: Uint8Array.of(0x50, 0x31),
        ContentEncodingScope: Uint8Array.of(0x50, 0x32),
        ContentEncodingType: Uint8Array.of(0x50, 0x33),
        ContentCompression: Uint8Array.of(0x50, 0x34),
        ContentCompAlgo: Uint8Array.of(0x42, 0x54),
        ContentCompSettings: Uint8Array.of(0x42, 0x55),
        ContentEncryption: Uint8Array.of(0x50, 0x35),
        ContentEncAlgo: Uint8Array.of(0x47, 0xE1),
        ContentEncKeyID: Uint8Array.of(0x47, 0xE2),
        ContentSignature: Uint8Array.of(0x47, 0xE3),
        ContentSigKeyID: Uint8Array.of(0x47, 0xE4),
        ContentSigAlgo: Uint8Array.of(0x47, 0xE5),
        ContentSigHashAlgo: Uint8Array.of(0x47, 0xE6),
        Cues: Uint8Array.of(0x1C, 0x53, 0xBB, 0x6B),
        CuePoint: Uint8Array.of(0xBB),
        CueTime: Uint8Array.of(0xB3),
        CueTrackPositions: Uint8Array.of(0xB7),
        CueTrack: Uint8Array.of(0xF7),
        CueClusterPosition: Uint8Array.of(0xF1),
        CueRelativePosition: Uint8Array.of(0xF0),
        CueDuration: Uint8Array.of(0xB2),
        CueBlockNumber: Uint8Array.of(0x53, 0x78),
        CueCodecState: Uint8Array.of(0xEA),
        CueReference: Uint8Array.of(0xDB),
        CueRefTime: Uint8Array.of(0x96),
        Attachments: Uint8Array.of(0x19, 0x41, 0xA4, 0x69),
        AttachedFile: Uint8Array.of(0x61, 0xA7),
        FileDescription: Uint8Array.of(0x46, 0x7E),
        FileName: Uint8Array.of(0x46, 0x6E),
        FileMimeType: Uint8Array.of(0x46, 0x60),
        FileData: Uint8Array.of(0x46, 0x5C),
        FileUID: Uint8Array.of(0x46, 0xAE),
        Chapters: Uint8Array.of(0x10, 0x43, 0xA7, 0x70),
        EditionEntry: Uint8Array.of(0x45, 0xB9),
        EditionUID: Uint8Array.of(0x45, 0xBC),
        EditionFlagHidden: Uint8Array.of(0x45, 0xBD),
        EditionFlagDefault: Uint8Array.of(0x45, 0xDB),
        EditionFlagOrdered: Uint8Array.of(0x45, 0xDD),
        ChapterAtom: Uint8Array.of(0xB6),
        ChapterUID: Uint8Array.of(0x73, 0xC4),
        ChapterStringUID: Uint8Array.of(0x56, 0x54),
        ChapterTimeStart: Uint8Array.of(0x91),
        ChapterTimeEnd: Uint8Array.of(0x92),
        ChapterFlagHidden: Uint8Array.of(0x98),
        ChapterFlagEnabled: Uint8Array.of(0x45, 0x98),
        ChapterSegmentUID: Uint8Array.of(0x6E, 0x67),
        ChapterSegmentEditionUID: Uint8Array.of(0x6E, 0xBC),
        ChapterPhysicalEquiv: Uint8Array.of(0x63, 0xC3),
        ChapterTrack: Uint8Array.of(0x8F),
        ChapterTrackNumber: Uint8Array.of(0x89),
        ChapterDisplay: Uint8Array.of(0x80),
        ChapString: Uint8Array.of(0x85),
        ChapLanguage: Uint8Array.of(0x43, 0x7C),
        ChapCountry: Uint8Array.of(0x43, 0x7E),
        ChapProcess: Uint8Array.of(0x69, 0x44),
        ChapProcessCodecID: Uint8Array.of(0x69, 0x55),
        ChapProcessPrivate: Uint8Array.of(0x45, 0x0D),
        ChapProcessCommand: Uint8Array.of(0x69, 0x11),
        ChapProcessTime: Uint8Array.of(0x69, 0x22),
        ChapProcessData: Uint8Array.of(0x69, 0x33),
        Tags: Uint8Array.of(0x12, 0x54, 0xC3, 0x67),
        Tag: Uint8Array.of(0x73, 0x73),
        Targets: Uint8Array.of(0x63, 0xC0),
        TargetTypeValue: Uint8Array.of(0x68, 0xCA),
        TargetType: Uint8Array.of(0x63, 0xCA),
        TagTrackUID: Uint8Array.of(0x63, 0xC5),
        TagEditionUID: Uint8Array.of(0x63, 0xC9),
        TagChapterUID: Uint8Array.of(0x63, 0xC4),
        TagAttachmentUID: Uint8Array.of(0x63, 0xC6),
        SimpleTag: Uint8Array.of(0x67, 0xC8),
        TagName: Uint8Array.of(0x45, 0xA3),
        TagLanguage: Uint8Array.of(0x44, 0x7A),
        TagDefault: Uint8Array.of(0x44, 0x84),
        TagString: Uint8Array.of(0x44, 0x87),
        TagBinary: Uint8Array.of(0x44, 0x85),
    };

    var id = {
    	ID: ID
    };

    var build = createCommonjsModule(function (module, exports) {
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    __export(ebml);
    __export(id);
    __export(typedArrayUtils);
    });

    function typeError(tag, expected) {
        throw new TypeError(`unexpected tag 0x${tag.toString(16)} (${expected} expected)`);
    }

    // positive fixint: 0xxx xxxx
    function posFixintTag(i) {
        return i & 0x7f;
    }
    function isPosFixintTag(tag) {
        return (tag & 0x80) === 0;
    }
    function readPosFixint(tag) {
        return tag & 0x7f;
    }
    // negative fixint: 111x xxxx
    function negFixintTag(i) {
        return 0xe0 | (i & 0x1f);
    }
    function isNegFixintTag(tag) {
        return (tag & 0xe0) == 0xe0;
    }
    function readNegFixint(tag) {
        return tag - 0x100;
    }
    // fixstr: 101x xxxx
    function fixstrTag(length) {
        return 0xa0 | (length & 0x1f);
    }
    function isFixstrTag(tag) {
        return (tag & 0xe0) == 0xa0;
    }
    function readFixstr(tag) {
        return tag & 0x1f;
    }
    // fixarray: 1001 xxxx
    function fixarrayTag(length) {
        return 0x90 | (length & 0x0f);
    }
    function isFixarrayTag(tag) {
        return (tag & 0xf0) == 0x90;
    }
    function readFixarray(tag) {
        return tag & 0x0f;
    }
    // fixmap: 1000 xxxx
    function fixmapTag(length) {
        return 0x80 | (length & 0x0f);
    }
    function isFixmapTag(tag) {
        return (tag & 0xf0) == 0x80;
    }
    function readFixmap(tag) {
        return tag & 0x0f;
    }
    function createReadBuffer(buf) {
        let view = ArrayBuffer.isView(buf) ? new DataView(buf.buffer, buf.byteOffset, buf.byteLength) : new DataView(buf);
        let n = 0;
        return {
            peek() {
                return view.getUint8(n);
            },
            get(len) {
                n += len;
                const off = view.byteOffset;
                return view.buffer.slice(off + n - len, off + n);
            },
            getI8() {
                return view.getInt8(n++);
            },
            getI16() {
                n += 2;
                return view.getInt16(n - 2);
            },
            getI32() {
                n += 4;
                return view.getInt32(n - 4);
            },
            getI64() {
                n += 8;
                const hi = view.getInt32(n - 8);
                const lo = view.getUint32(n - 4);
                return hi * 0x100000000 + lo;
            },
            getUi8() {
                return view.getUint8(n++);
            },
            getUi16() {
                n += 2;
                return view.getUint16(n - 2);
            },
            getUi32() {
                n += 4;
                return view.getUint32(n - 4);
            },
            getUi64() {
                n += 8;
                const hi = view.getUint32(n - 8);
                const lo = view.getUint32(n - 4);
                return hi * 0x100000000 + lo;
            },
            getF32() {
                n += 4;
                return view.getFloat32(n - 4);
            },
            getF64() {
                n += 8;
                return view.getFloat64(n - 8);
            },
        };
    }
    function putBlob(buf, blob, baseTag) {
        const n = blob.byteLength;
        if (n <= 255) {
            buf.putUi8(baseTag);
            buf.putUi8(n);
        }
        else if (n <= 65535) {
            buf.putUi8(baseTag + 1);
            buf.putUi16(n);
        }
        else if (n <= 4294967295) {
            buf.putUi8(baseTag + 2);
            buf.putUi32(n);
        }
        else {
            throw new RangeError("length limit exceeded");
        }
        buf.put(blob);
    }
    function getBlob(buf) {
        const tag = buf.getUi8();
        let n;
        switch (tag) {
            case 192 /* Nil */:
                n = 0;
                break;
            case 196 /* Bin8 */:
            case 217 /* Str8 */:
                n = buf.getUi8();
                break;
            case 197 /* Bin16 */:
            case 218 /* Str16 */:
                n = buf.getUi16();
                break;
            case 198 /* Bin32 */:
            case 219 /* Str32 */:
                n = buf.getUi32();
                break;
            default:
                if (!isFixstrTag(tag)) {
                    typeError(tag, "bytes or string");
                }
                n = readFixstr(tag);
        }
        return buf.get(n);
    }
    function putArrHeader(buf, n) {
        if (n < 16) {
            buf.putUi8(fixarrayTag(n));
        }
        else {
            putCollectionHeader(buf, 220 /* Array16 */, n);
        }
    }
    function getArrHeader(buf, expect) {
        const tag = buf.getUi8();
        const n = isFixarrayTag(tag)
            ? readFixarray(tag)
            : getCollectionHeader(buf, tag, 220 /* Array16 */, "array");
        if (expect != null && n !== expect) {
            throw new Error(`invalid array header size ${n}`);
        }
        return n;
    }
    function putMapHeader(buf, n) {
        if (n < 16) {
            buf.putUi8(fixmapTag(n));
        }
        else {
            putCollectionHeader(buf, 222 /* Map16 */, n);
        }
    }
    function getMapHeader(buf, expect) {
        const tag = buf.getUi8();
        const n = isFixmapTag(tag)
            ? readFixmap(tag)
            : getCollectionHeader(buf, tag, 222 /* Map16 */, "map");
        if (expect != null && n !== expect) {
            throw new Error(`invalid map header size ${n}`);
        }
        return n;
    }
    function putCollectionHeader(buf, baseTag, n) {
        if (n <= 65535) {
            buf.putUi8(baseTag);
            buf.putUi16(n);
        }
        else if (n <= 4294967295) {
            buf.putUi8(baseTag + 1);
            buf.putUi32(n);
        }
        else {
            throw new RangeError("length limit exceeded");
        }
    }
    function getCollectionHeader(buf, tag, baseTag, typename) {
        switch (tag) {
            case 192 /* Nil */:
                return 0;
            case baseTag: // 16 bit
                return buf.getUi16();
            case baseTag + 1: // 32 bit
                return buf.getUi32();
            default:
                typeError(tag, typename);
        }
    }

    const Any = {
        enc(buf, v) {
            typeOf(v).enc(buf, v);
        },
        dec(buf) {
            return tagType(buf.peek()).dec(buf);
        },
    };
    const Nil = {
        enc(buf, v) {
            buf.putUi8(192 /* Nil */);
        },
        dec(buf) {
            const tag = buf.getUi8();
            if (tag !== 192 /* Nil */) {
                typeError(tag, "nil");
            }
            return null;
        },
    };
    const Bool = {
        enc(buf, v) {
            buf.putUi8(v ? 195 /* True */ : 194 /* False */);
        },
        dec(buf) {
            const tag = buf.getUi8();
            switch (tag) {
                case 192 /* Nil */:
                case 194 /* False */:
                    return false;
                case 195 /* True */:
                    return true;
                default:
                    typeError(tag, "bool");
            }
        },
    };
    const Int = {
        enc(buf, v) {
            if (-128 <= v && v <= 127) {
                if (v >= 0) {
                    buf.putUi8(posFixintTag(v));
                }
                else if (v > -32) {
                    buf.putUi8(negFixintTag(v));
                }
                else {
                    buf.putUi8(208 /* Int8 */);
                    buf.putUi8(v);
                }
            }
            else if (-32768 <= v && v <= 32767) {
                buf.putI8(209 /* Int16 */);
                buf.putI16(v);
            }
            else if (-2147483648 <= v && v <= 2147483647) {
                buf.putI8(210 /* Int32 */);
                buf.putI32(v);
            }
            else {
                buf.putI8(211 /* Int64 */);
                buf.putI64(v);
            }
        },
        dec(buf) {
            const tag = buf.getUi8();
            if (isPosFixintTag(tag)) {
                return readPosFixint(tag);
            }
            else if (isNegFixintTag(tag)) {
                return readNegFixint(tag);
            }
            switch (tag) {
                case 192 /* Nil */:
                    return 0;
                // signed int types
                case 208 /* Int8 */:
                    return buf.getI8();
                case 209 /* Int16 */:
                    return buf.getI16();
                case 210 /* Int32 */:
                    return buf.getI32();
                case 211 /* Int64 */:
                    return buf.getI64();
                // unsigned int types
                case 204 /* Uint8 */:
                    return buf.getUi8();
                case 205 /* Uint16 */:
                    return buf.getUi16();
                case 206 /* Uint32 */:
                    return buf.getUi32();
                case 207 /* Uint64 */:
                    return buf.getUi64();
                default:
                    typeError(tag, "int");
            }
        },
    };
    const Uint = {
        enc(buf, v) {
            if (v < 0) {
                throw new Error(`not an uint: ${v}`);
            }
            else if (v <= 127) {
                buf.putUi8(posFixintTag(v));
            }
            else if (v <= 255) {
                buf.putUi8(204 /* Uint8 */);
                buf.putUi8(v);
            }
            else if (v <= 65535) {
                buf.putUi8(205 /* Uint16 */);
                buf.putUi16(v);
            }
            else if (v <= 4294967295) {
                buf.putUi8(206 /* Uint32 */);
                buf.putUi32(v);
            }
            else {
                buf.putUi8(207 /* Uint64 */);
                buf.putUi64(v);
            }
        },
        dec(buf) {
            const v = Int.dec(buf);
            if (v < 0) {
                throw new RangeError("uint underflow");
            }
            return v;
        },
    };
    const Float = {
        enc(buf, v) {
            buf.putUi8(203 /* Float64 */);
            buf.putF(v);
        },
        dec(buf) {
            const tag = buf.getUi8();
            switch (tag) {
                case 192 /* Nil */:
                    return 0;
                case 202 /* Float32 */:
                    return buf.getF32();
                case 203 /* Float64 */:
                    return buf.getF64();
                default:
                    typeError(tag, "float");
            }
        },
    };
    const Bytes = {
        enc(buf, v) {
            putBlob(buf, v, 196 /* Bin8 */);
        },
        dec: getBlob,
    };
    const Str = {
        enc(buf, v) {
            const utf8 = toUTF8(v);
            if (utf8.byteLength < 32) {
                buf.putUi8(fixstrTag(utf8.byteLength));
                buf.put(utf8);
            }
            else {
                putBlob(buf, utf8, 217 /* Str8 */);
            }
        },
        dec(buf) {
            return fromUTF8(getBlob(buf));
        },
    };
    const Time = {
        enc(buf, v) {
            const ms = v.getTime();
            buf.putUi8(199 /* Ext8 */);
            buf.putUi8(12);
            buf.putI8(-1);
            buf.putUi32((ms % 1000) * 1000000);
            buf.putI64(ms / 1000);
        },
        dec(buf) {
            const tag = buf.getUi8();
            switch (tag) {
                case 214 /* FixExt4 */: // 32-bit seconds
                    if (buf.getI8() === -1) {
                        return new Date(buf.getUi32() * 1000);
                    }
                    break;
                case 215 /* FixExt8 */: // 34-bit seconds + 30-bit nanoseconds
                    if (buf.getI8() === -1) {
                        const lo = buf.getUi32();
                        const hi = buf.getUi32();
                        // seconds: hi + (lo&0x3)*0x100000000
                        // nanoseconds: lo>>2 == lo/4
                        return new Date((hi + (lo & 0x3) * 0x100000000) * 1000 + lo / 4000000);
                    }
                    break;
                case 199 /* Ext8 */: // 64-bit seconds + 32-bit nanoseconds
                    if (buf.getUi8() === 12 && buf.getI8() === -1) {
                        const ns = buf.getUi32();
                        const s = buf.getI64();
                        return new Date(s * 1000 + ns / 1000000);
                    }
                    break;
            }
            typeError(tag, "time");
        },
    };
    const Arr = TypedArr(Any);
    const Map$1 = TypedMap(Any, Any);
    function TypedArr(valueT) {
        return {
            encHeader: putArrHeader,
            decHeader: getArrHeader,
            enc(buf, v) {
                putArrHeader(buf, v.length);
                v.forEach(x => valueT.enc(buf, x));
            },
            dec(buf) {
                const res = [];
                for (let n = getArrHeader(buf); n > 0; --n) {
                    res.push(valueT.dec(buf));
                }
                return res;
            },
        };
    }
    function TypedMap(keyT, valueT) {
        return {
            encHeader: putMapHeader,
            decHeader: getMapHeader,
            enc(buf, v) {
                const props = Object.keys(v);
                putMapHeader(buf, props.length);
                props.forEach(p => {
                    keyT.enc(buf, p);
                    valueT.enc(buf, v[p]);
                });
            },
            dec(buf) {
                const res = {};
                for (let n = getMapHeader(buf); n > 0; --n) {
                    const k = keyT.dec(buf);
                    res[k] = valueT.dec(buf);
                }
                return res;
            },
        };
    }
    function toUTF8(v) {
        const n = v.length;
        const bin = new Uint8Array(4 * n);
        let pos = 0, i = 0, c;
        while (i < n) {
            c = v.charCodeAt(i++);
            if ((c & 0xfc00) === 0xd800) {
                c = (c << 10) + v.charCodeAt(i++) - 0x35fdc00;
            }
            if (c < 0x80) {
                bin[pos++] = c;
            }
            else if (c < 0x800) {
                bin[pos++] = 0xc0 + (c >> 6);
                bin[pos++] = 0x80 + (c & 0x3f);
            }
            else if (c < 0x10000) {
                bin[pos++] = 0xe0 + (c >> 12);
                bin[pos++] = 0x80 + ((c >> 6) & 0x3f);
                bin[pos++] = 0x80 + (c & 0x3f);
            }
            else {
                bin[pos++] = 0xf0 + (c >> 18);
                bin[pos++] = 0x80 + ((c >> 12) & 0x3f);
                bin[pos++] = 0x80 + ((c >> 6) & 0x3f);
                bin[pos++] = 0x80 + (c & 0x3f);
            }
        }
        return bin.buffer.slice(0, pos);
    }
    function fromUTF8(buf) {
        return (new TextDecoder("utf-8")).decode(buf);
    }
    function typeOf(v) {
        switch (typeof v) {
            case "undefined":
                return Nil;
            case "boolean":
                return Bool;
            case "number":
                return !isFinite(v) || Math.floor(v) !== v ? Float
                    : v < 0 ? Int
                        : Uint;
            case "string":
                return Str;
            case "object":
                return v === null ? Nil
                    : Array.isArray(v) ? Arr
                        : v instanceof Uint8Array || v instanceof ArrayBuffer ? Bytes
                            : v instanceof Date ? Time
                                : Map$1;
            default:
                throw new TypeError(`unsupported type ${typeof v}`);
        }
    }
    function tagType(tag) {
        switch (tag) {
            case 192 /* Nil */:
                return Nil;
            case 194 /* False */:
            case 195 /* True */:
                return Bool;
            case 208 /* Int8 */:
            case 209 /* Int16 */:
            case 210 /* Int32 */:
            case 211 /* Int64 */:
                return Int;
            case 204 /* Uint8 */:
            case 205 /* Uint16 */:
            case 206 /* Uint32 */:
            case 207 /* Uint64 */:
                return Uint;
            case 202 /* Float32 */:
            case 203 /* Float64 */:
                return Float;
            case 196 /* Bin8 */:
            case 197 /* Bin16 */:
            case 198 /* Bin32 */:
                return Bytes;
            case 217 /* Str8 */:
            case 218 /* Str16 */:
            case 219 /* Str32 */:
                return Str;
            case 220 /* Array16 */:
            case 221 /* Array32 */:
                return Arr;
            case 222 /* Map16 */:
            case 223 /* Map32 */:
                return Map$1;
            case 214 /* FixExt4 */:
            case 215 /* FixExt8 */:
            case 199 /* Ext8 */:
                return Time;
            default:
                if (isPosFixintTag(tag) || isNegFixintTag(tag)) {
                    return Int;
                }
                if (isFixstrTag(tag)) {
                    return Str;
                }
                if (isFixarrayTag(tag)) {
                    return Arr;
                }
                if (isFixmapTag(tag)) {
                    return Map$1;
                }
                throw new TypeError(`unsupported tag ${tag}`);
        }
    }
    function decode(buf, typ) {
        return (typ || Any).dec(createReadBuffer(buf));
    }

    /**
     * @vkontakte/calls-sdk v2.8.2-beta.6
     * Fri, 28 Apr 2023 13:27:47 GMT
     * https://st.mycdn.me/static/callssdk/2-8-2/doc/
     */

    var Ja=Object.defineProperty,Ya=Object.defineProperties;var Qa=Object.getOwnPropertyDescriptors;var Or=Object.getOwnPropertySymbols;var Xa=Object.prototype.hasOwnProperty,Za=Object.prototype.propertyIsEnumerable;var xr=Math.pow,wr=(n,r,e)=>r in n?Ja(n,r,{enumerable:!0,configurable:!0,writable:!0,value:e}):n[r]=e,Re=(n,r)=>{for(var e in r||(r={}))Xa.call(r,e)&&wr(n,e,r[e]);if(Or)for(var e of Or(r))Za.call(r,e)&&wr(n,e,r[e]);return n},ze=(n,r)=>Ya(n,Qa(r));var c=(n,r,e)=>new Promise((t,i)=>{var a=p=>{try{s(e.next(p));}catch(u){i(u);}},o=p=>{try{s(e.throw(p));}catch(u){i(u);}},s=p=>p.done?t(p.value):Promise.resolve(p.value).then(a,o);s((e=e.apply(n,r)).next());});var Rt=class{createJoinLink(r){return c(this,null,function*(){return {join_link:"nop"}})}removeJoinLink(r){return c(this,null,function*(){return {success:!0}})}getAnonymTokenByLink(r,e){return c(this,null,function*(){return ""})}log(r){}prepareUserIds(r){return c(this,null,function*(){})}getCachedOkIdByExternalId(r){return null}cacheExternalId(r,e){}hangupConversation(r){}removeHistoryRecords(r){return c(this,null,function*(){})}cleanup(){}};var Ct=class{log(r,e,t=!1){}destroy(){}};var te=class{constructor(){this._handlers={};this._listeners=[];}_triggerEvent(r,...e){if(this._handlers.hasOwnProperty(r))for(let t of this._handlers[r])t.apply(this,e);}addEventListener(r,e){if(typeof e!="function")throw new Error("Listener should be a function");return this._handlers.hasOwnProperty(r)||(this._handlers[r]=[]),this._handlers[r].push(e),{dispose:this.removeEventListener.bind(this,r,e)}}removeEventListener(r,e){if(!this._handlers.hasOwnProperty(r))return;e||delete this._handlers[r];let t=this._handlers[r].indexOf(e);t>=0&&this._handlers[r].splice(t,1);}subscribe(r,e,t){let i=r.addEventListener(e,t);this._listeners.push(i);}unsubscribe(){this._listeners.forEach(r=>{r.dispose();});}};var Pt=class extends te{get ready(){return !0}setParticipantIdRegistry(r){}requestRealloc(){}setEndpoint(r){}setConversationId(r){}readyToSend(){}cleanup(){}requestTestMode(r,e){}getNextCommandSequenceNumber(){return 0}};var Lr=(t=>(t.INCOMING="INCOMING",t.OUTGOING="OUTGOING",t.JOINING="JOINING",t))(Lr||{}),Je=Lr;var Nr=(t=>(t.USER="USER",t.GROUP="GROUP",t.CHAT="CHAT",t))(Nr||{}),Ke=Nr;var Ur=(e=>(e.ATTENDEE="ATTENDEE",e.HAND_UP="HAND_UP",e))(Ur||{}),$i=Ur;var Br=(t=>(t.ADD_PARTICIPANT="ADD_PARTICIPANT",t.RECORD="RECORD",t.MOVIE_SHARE="MOVIE_SHARE",t))(Br||{}),qi=Br;var Fr=(a=>(a.REQUIRE_AUTH_TO_JOIN="REQUIRE_AUTH_TO_JOIN",a.AUDIENCE_MODE="AUDIENCE_MODE",a.WAITING_HALL="WAITING_HALL",a.ASR="ASR",a.FEEDBACK="FEEDBACK",a))(Fr||{}),zi=Fr;function Vr(n,r){if(n.length!==r.length)return !1;for(let e of n)if(!r.includes(e))return !1;return !0}function jr(n,r){let e=new Set(n);for(let[t,i]of Object.entries(r))i?e.add(t):e.delete(t);return Array.from(e)}var Hr=(D=>(D.CAMERA_PERMISSION="camera",D.MIC_PERMISSION="mic",D.CAMERA_ACCESS="cameralock",D.MIC_ACCESS="miclock",D.MIC_NOT_FOUND="nomic",D.SCREEN_PERMISSION="screenpermission",D.SCREEN_ACCESS="screenlock",D.CONNECTION="connection",D.NETWORK="network",D.UNKNOWN="unknown",D.UNSUPPORTED="unsupported",D.SIGNALING_FAILED="signalingfailed",D.API="api",D.AUTH="auth",D))(Hr||{}),ie=Hr;var Gr=(Z=>(Z.CANCELED="CANCELED",Z.REJECTED="REJECTED",Z.REMOVED="REMOVED",Z.HUNGUP="HUNGUP",Z.MISSED="MISSED",Z.BUSY="BUSY",Z.FAILED="FAILED",Z.NETWORK_ERROR="NETWORK_ERROR",Z.KILLED="KILLED",Z.BANNED="BANNED",Z.HAS_ACTIVE_CALL="HAS_ACTIVE_CALL",Z.CALLER_IS_BLOCKED="CALLER_IS_BLOCKED",Z.NOT_FRIENDS="NOT_FRIENDS",Z.CALLEE_IS_OFFLINE="CALLEE_IS_OFFLINE",Z.CALLER_IS_REJECTED="CALLER_IS_REJECTED",Z.UNKNOWN_ERROR="UNKNOWN_ERROR",Z.UNSUPPORTED="UNSUPPORTED",Z.OLD_VERSION="OLD_VERSION",Z.SERVICE_DISABLED="SERVICE_DISABLED",Z.EXTERNAL_API_ERROR="EXTERNAL_API_ERROR",Z.SOCKET_CLOSED="SOCKET_CLOSED",Z.ENDED="ENDED",Z.KILLED_WITHOUT_DELETE="KILLED_WITHOUT_DELETE",Z.ANOTHER_DEVICE="ANOTHER_DEVICE",Z.NOT_FOUND="NOT_FOUND",Z))(Gr||{}),O$1=Gr;var Wr=(o=>(o.AUDIO="AUDIO",o.VIDEO="VIDEO",o.SCREEN_SHARING="SCREEN_SHARING",o.MOVIE_SHARING="MOVIE_SHARING",o.AUDIO_SHARING="AUDIO_SHARING",o.ANIMOJI="ANIMOJI",o))(Wr||{}),de=Wr;var Kr=(t=>(t.UNMUTE="UNMUTE",t.MUTE="MUTE",t.MUTE_PERMANENT="MUTE_PERMANENT",t))(Kr||{}),xe=Kr;var $r=(i=>(i.CALLED="CALLED",i.ACCEPTED="ACCEPTED",i.REJECTED="REJECTED",i.HUNGUP="HUNGUP",i))($r||{}),W$1=$r;var qr=(t=>(t.UPDATE="UPDATE",t.REMOVE="REMOVE",t.ACTIVATE="ACTIVATE",t))(qr||{}),Kt=qr;var zr=(i=>(i.START="start",i.ACCEPT="accept",i.JOIN="join",i.RETRY="retry",i))(zr||{}),$e=zr;var Jr=(t=>(t.NOTIFICATION="NOTIFICATION",t.FAILED="FAILED",t.RECONNECT="RECONNECT",t))(Jr||{}),ve=Jr;var Yr=(B=>(B.TRANSMITTED_DATA="transmitted-data",B.ACCEPTED_CALL="accepted-call",B.HUNGUP="hungup",B.PARTICIPANT_ADDED="participant-added",B.PARTICIPANT_JOINED="participant-joined",B.CLOSED_CONVERSATION="closed-conversation",B.MEDIA_SETTINGS_CHANGED="media-settings-changed",B.PARTICIPANT_STATE_CHANGED="participant-state-changed",B.RATE_CALL_DATA="rate-call-data",B.FEATURE_SET_CHANGED="feature-set-changed",B.TOPOLOGY_CHANGED="topology-changed",B.PRODUCER_UPDATED="producer-updated",B.CONSUMER_ANSWERED="consumer-answered",B.MULTIPARTY_CHAT_CREATED="multiparty-chat-created",B.FORCE_MEDIA_SETTINGS_CHANGE="force-media-settings-change",B.SETTINGS_UPDATE="settings-update",B.VIDEO_QUALITY_UPDATE="video-quality-update",B.REGISTERED_PEER="registered-peer",B.SWITCH_MICRO="switch-micro",B.RECORD_STARTED="record-started",B.RECORD_STOPPED="record-stopped",B.REALLOC_CON="realloc-con",B.AUDIO_ACTIVITY="audio-activity",B.SPEAKER_CHANGED="speaker-changed",B.STALLED_ACTIVITY="stalled-activity",B.CHAT_MESSAGE="chat-message",B.CUSTOM_DATA="custom-data",B.ROLES_CHANGED="roles-changed",B.MUTE_PARTICIPANT="mute-participant",B.PIN_PARTICIPANT="pin-participant",B.OPTIONS_CHANGED="options-changed",B.NETWORK_STATUS="network-status",B.PARTICIPANT_SOURCES_UPDATE="participant-sources-update",B.PROMOTE_PARTICIPANT="promote-participant",B.CHAT_ROOM_UPDATED="chat-room-updated",B.PROMOTION_APPROVED="promotion-approved",B.JOIN_LINK_CHANGED="join-link-changed",B.FEEDBACK="feedback",B.MOVIE_UPDATE_NOTIFICATION="movie-update-notification",B.MOVIE_SHARE_INFO="movie-share-info",B.MOVIE_SHARE_STARTED="movie-share-started",B.MOVIE_SHARE_STOPPED="movie-share-stopped",B.ROOM_UPDATED="room-updated",B.ROOMS_UPDATED="rooms-updated",B.ROOM_PARTICIPANTS_UPDATED="room-participants-updated",B.FEATURES_PER_ROLE_CHANGED="features-per-role-changed",B.PARTICIPANT_ANIMOJI_CHANGED="participant-animoji-changed",B.ASR_STARTED="asr-started",B.ASR_STOPPED="asr-stopped",B))(Yr||{}),w$1=Yr;var Qr=(_=>(_.ERROR="callError",_.DEVICES="callDevices",_.CALL_SPEC_ERROR="callSpecError",_.ICE_CONNECTION_STATE="callIceConnectionState",_.ICE_CONNECTION_TYPE="callIceConnectionType",_.ICE_RESTART="callIceRestart",_.PUSH="callPush",_.OUTGOING_CALL="callStart",_.OUTGOING_MULTIPARTY_CALL="callStartMultiparty",_.JOIN_CONVERSATION="callJoinConversation",_.ACCEPTED_OUTGOING="callAcceptedOutgoing",_.ACCEPT_INCOMING="callAcceptIncoming",_.DECLINE_INCOMING="callDeclineIncoming",_.ACCEPT_CONCURRENT="callAcceptConcurrent",_.HANGUP="callHangup",_.MEDIA_STATUS="callMediaStatus",_.DEVICE_CHANGED="callDeviceChanged",_.SOCKET_ACTION="callSocketAction",_.ADD_PARTICIPANT="callAddParticipant",_.REMOVE_PARTICIPANT="callRemoveParticipant",_.POOR_CONNECTION="callPoorConnection",_.TOPOLOGY_CHANGE_REQUESTED="callTopologyChangeRequested",_.RELAY_POLICY="callForceRelay",_.PAT_ALLOCATED="patAllocate",_.PAT_DEALLOCATED="patDeallocate",_.PAT_ERROR="patError",_.PAT_WAITING_TIME_ERROR="patWaitingTimeError",_.PAT_OUTDATED_RESPONSE="patOutdatedResponse",_.SIGNALING_CONNECTED="signaling_connected",_.RECONNECT="callReconnect",_.SCREENSHARE_FIRST_FRAME="screen_share_first_frame",_.SCREENSHARE_FREEZE_DURATION="callScreenshareFreezeDuration",_.FIRST_MEDIA_RECEIVED="first_media_received",_.CALL_EVENTUAL_STAT="callEventualStat",_))(Qr||{}),S$1=Qr;var Xr=(e=>(e.AUDIO_MIX="audio-mix",e.PARTICIPANT_AGNOSTIC_TRACK_PREFIX="pat",e))(Xr||{}),Le=Xr;var Zr=(e=>(e.NO_AVAILABLE_TRACKS="no-available-tracks",e.UNKNOWN_ERROR="unknown-error",e))(Zr||{}),ea=Zr;function ta(n){switch(n){case 1:return "no-available-tracks";default:return "unknown-error"}}var ia=(e=>(e.CREATOR="CREATOR",e.ADMIN="ADMIN",e))(ia||{}),Ye=ia;function $t(n,r){if(n.length!==r.length)return !1;for(let e of n)if(!r.includes(e))return !1;return !0}var ra=(e=>(e.USER="USER",e.GROUP="GROUP",e))(ra||{}),z$1=ra;var mi=class{constructor(){this._items=[];}get length(){return this._items.length}push(r){this._items.push(r);}shift(){return this._items.shift()||null}bisect(){let r=this.length>1?Math.floor(this.length/2):1;this._items=this._items.slice(r);}clear(){this._items=[];}toString(){return this._items.length?JSON.stringify(this._items,(r,e)=>e instanceof Error?String(e):e):""}};var aa=2*1024*1024,en=512*1024,qt=100*1024,tn=5,Yi="_okcls_logs_session_",rn=3e4,Qi=class{constructor(){this._items=[];this._itemsSize=0;this._storageSize=aa;try{let r=window.localStorage;for(let e of Object.keys(r)){if(e.indexOf(Yi)!==0)continue;let t=r.getItem(e);if(!t){na(e);continue}let i=sa(t);this.add(e,i);}}catch(r){console.error("Storage is blocked",r),this._storageSize=0;}this._items.sort((r,e)=>r.date-e.date),this.cleanup(qt);}get size(){return this._itemsSize}get length(){return this._items.length}get available(){return Math.max(this._storageSize-this._itemsSize,0)}get items(){return this._items}set storageSize(r){this._storageSize=r;}add(r,e){let t=parseInt(r.replace(Yi,""),10);this._itemsSize+=e,this._items.push({key:r,size:e,date:t});}deleteOldestItem(){let r=this._items.shift();r&&(na(r.key),this._itemsSize-=r.size);}cleanup(r){for(;this.length&&(this.size>aa||this.length>tn-1||this.size+r>this.available);)this.deleteOldestItem();}};function oa(){return `${Yi}${Date.now()}`}function sa(n){return new Blob([n]).size}function na(n){try{window.localStorage.removeItem(n);}catch(r){console.error("Failed to remove log from storage",r);}}function Xi(){let n=dt.toString();if(!Ie.available||!n)return;let r=sa(n);Ie.cleanup(r);try{window.localStorage.setItem(hi,n);}catch(e){if(console.warn("Failed to write log to storage",e),Ie.storageSize=Ie.size+r,Ie.cleanup(qt+r),Ie.available>=qt+r){Xi();return}if(r>qt){dt.bisect(),Xi();return}Ie.storageSize=0;return}r>en&&(Ie.add(hi,r),hi=oa(),dt.clear(),Ie.cleanup(qt));}function Zi(){!Ie.available||!dt.length||Xi();}function an(n=!1){let r=[];try{let i=window.localStorage;for(let o of Ie.items){let s=i.getItem(o.key);r.push(s);}let a=dt.toString();a&&r.push(a);}catch(i){console.error("Storage is blocked",i);}let e=`[${r.join(",")}]`;if(n)return e;let t=`logs_${Date.now()}.json`;return nn(e,t),t}function nn(n,r){let e=document.createElement("a"),t=new Blob([n],{type:"text/json"});e.href=URL.createObjectURL(t),e.download=r,e.click();}function ca(n,r){if(!Ie.available)return;let e=new Date;dt.push({t:e.getTime(),l:n,d:r,h:e.toLocaleString("ru-RU",{dateStyle:"short",timeStyle:"long"})}),Ji||(Ji=window.setTimeout(()=>{Ji=null,Zi();},rn));}function er(){Ie||(Ie=new Qi,dt=new mi,hi=oa(),window.addEventListener("beforeunload",Zi));}var Ie,dt,hi,Ji=null;window.__VKCallsSDKLogs__=(n=!1)=>(Ie||er(),Zi(),an(n));var v$1=class extends Ct{constructor(e,t){super();this._batchInterval=3e3;this._batch=[];this._batchTimeout=null;this._api=e,this._externalLogger=t;}_send(e){this._api.log(e);}_sendBatch(){this._stopTimeout(),this._batch.length>0&&(this._send(this._batch),this._batch=[],this._startTimeout());}_startTimeout(){this._batchTimeout=window.setTimeout(()=>this._sendBatch(),this._batchInterval);}_stopTimeout(){this._batchTimeout&&(clearTimeout(this._batchTimeout),this._batchTimeout=null);}_onUnload(){this._sendBatch(),this._stopTimeout();}log(e,t,i=!1){let a={};typeof t!="undefined"&&(a.param=t),this._logInternal(e,a,i),this._externalLogger&&this._externalLogger.log(e,t,i);}logCustom(e,t,i=!1){this._logInternal(e,t,i);}_logInternal(e,t,i){let a={type:1,time:0,operation:e,timestamp:Date.now(),custom:Object.assign(t,{vcid:N$1.id()}),uid:this._api.getUserId()};this._batch.push(a),(i||!this._batchTimeout)&&this._sendBatch();}destroy(){this._sendBatch(),this._stopTimeout(),this._externalLogger&&this._externalLogger.destroy();}static create(e,t){v$1._instance||(v$1._instance=new v$1(e,t));}static log(e,t,i=!1){v$1._instance&&v$1._instance.log(e,t,i);}static logCustom(e,t,i=!1){v$1._instance&&v$1._instance.logCustom(e,t,i);}static destroy(){v$1._instance&&v$1._instance.destroy(),v$1._instance=null;}};var Ne=class{constructor(){this._worker=null;}_createWorker(o,s){return c(this,arguments,function*(r,e,t=[],i={},a=[]){return new Promise((p,u)=>{let m=t.join(","),E=new Blob([r,`exports.default(${m});`],{type:"application/javascript; charset=utf-8"}),P=window.URL.createObjectURL(E);this._worker=new Worker(P),this._worker.onmessage=k=>{switch(k.data.type){case"ready":p();break;case"error":u(k.data.error);break;case"frame":e(k.data);break;case"debug":d.debug(k.data.message);break;case"log_error":v$1.log(S$1.ERROR,k.data.message);break}},this._sendToWorker("init",i,a);})})}_removeWorker(){var r;(r=this._worker)==null||r.terminate(),this._worker=null;}_sendToWorker(r,e={},t=[]){var i;(i=this._worker)==null||i.postMessage(Object.assign({type:r},e),t);}static isBrowserSupported(){throw new Error("Not implemented")}};var lt=class extends Ne{init(r){return c(this,null,function*(){d.debug("LibVPxDecoder started"),yield this._createWorker('"use strict";var exports=(()=>{var d=Object.defineProperty;var x=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var E=Object.prototype.hasOwnProperty;var R=(o,t)=>{for(var e in t)d(o,e,{get:t[e],enumerable:!0})},h=(o,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let a of y(t))!E.call(o,a)&&a!==e&&d(o,a,{get:()=>t[a],enumerable:!(s=x(t,a))||s.enumerable});return o};var M=o=>h(d({},"__esModule",{value:!0}),o);var D={};R(D,{default:()=>V});var V=(o,t)=>{let e=null,s=null,a=!0;function f(){return o({locateFile:t}).then(r=>s=r)}function u(r,c,n,g){if(!s){self.postMessage({type:"log_error",message:"decoder-init-fail-libvpx"}),self.postMessage({type:"frame",error:"Fatal initialization error"});return}if(a!==n&&(a=n,e&&(e=null,self.postMessage({type:"debug",message:`LibVPxDecoder codec changed to ${n?"VP9":"VP8"} - reinitialize`}))),!e&&(self.postMessage({type:"debug",message:`LibVPxDecoder codec ${n?"VP9":"VP8"}`}),e=new s.VpxDecoder,e.debug(g),!e.init(n?s.VpxType.VP9:s.VpxType.VP8))){e=null,self.postMessage({type:"frame",error:"Decoder failed to create"});return}try{e.allocateBuffer(c.byteLength).set(new Uint8Array(c))}catch(i){self.postMessage({type:"debug",message:i}),e=null,self.postMessage({type:"frame",error:String(i)});return}if(!(e.decode()&&e.nextImage())){self.postMessage({type:"frame",error:"Decode failed"});return}let l=e.getImageBuffer();if(!l){self.postMessage({type:"frame",error:"No decoded data"});return}let m=e.getImageWidth(),b=e.getImageHeight();e.nextImage()&&(self.postMessage({type:"debug",message:"LibVPxDecoder dropped frame"}),self.postMessage({type:"log_error",message:"LibVPxDecoder-drop"}));let p=new Uint8ClampedArray(l.byteLength);p.set(l),self.postMessage({type:"frame",data:p.buffer,width:m,height:b},[p.buffer])}f().then(()=>{self.onmessage=r=>{switch(r.data.type){case"frame":u(r.data.timestamp,r.data.data,r.data.isVP9,r.data.debug);break}},self.postMessage({type:"ready"})}).catch(r=>{self.postMessage({type:"error",error:String(r)})})};return M(D);})();\n',e=>{if(e.error)d.warn("LibVPxDecoder",e.error);else {let t=new ImageData(new Uint8ClampedArray(e.data),e.width,e.height);r(t);}},[libvpx_1,libvpx_1.getUrl]);})}decodeFrame(r,e,t,i){this._sendToWorker("frame",{timestamp:r,data:e.buffer,isVP9:t,keyFrame:i,debug:d.enabled()},[e.buffer]);}destroy(){this._removeWorker(),d.debug("LibVPxDecoder destroyed");}static isBrowserSupported(){return "WebAssembly"in window&&"Worker"in window}};var la=typeof Object.fromEntries=="function"?Object.fromEntries:function(n){if(!n||!n[Symbol.iterator])throw new Error("Object.fromEntries() requires a single iterable argument");let r={};for(let[e,t]of n)r[e]=t;return r};function pa(n){return c(this,null,function*(){return new Promise((r,e)=>{let t=new FileReader;t.onload=i=>{r(i.target.result);},t.onerror=e,t.readAsArrayBuffer(n);})})}var yt=":",gi="d",sn=533,tr="a=fmtp:",cn="sps-pps-idr-in-keyframe=1",ir;(ui=>{function n(T,_,A,I,C,L=!1,H=!1){let oe=/[\r\n]+/,pe=`\r
`;if(!_&&!A&&!I&&!H&&!L&&!C)return T;function Me(K){let me=["a=rtcp-fb:111 nack","a=rtcp-fb:111 nack pli"],Se="a=rtcp-fb:111",ee=K.findIndex(J=>J.startsWith(Se));return ~ee&&(K[ee]=K[ee]+pe+me.join(pe)),K}function Ge(K,me,Se){let ee=K.split(" "),J=ee.slice(0,3),se;for(se=3;se<ee.length;se++)Se.includes(ee[se])&&J.push(ee[se]);for(se=3;se<ee.length;se++)!Se.includes(ee[se])&&!me.includes(ee[se])&&J.push(ee[se]);return J.join(" ")}function Ae(K,me){let Se=new RegExp("a=rtpmap:(\\d+) ([a-zA-Z0-9-]+)\\/\\d+"),ee,J=[];for(ee=0;ee<K.length;++ee){let se=K[ee].match(Se);se&&se.length===3&&se[2]===me&&J.push(se[1]);}return J}function De(K,me,Se,ee){let J,se="m="+me;for(J=0;J<K.length;++J)if(K[J].startsWith(se)){K[J]=Ge(K[J],Se,ee);break}}function ke(K,me){let Se=new RegExp(tr+"(\\d+)");for(let ee=0;ee<K.length;++ee){let J=K[ee].match(Se);if(J&&J.length===2&&me.includes(J[1])){let se=K[ee].trim()===tr+J[1]?" ":";";K[ee]+=se+cn;}}}function U(K){let me=Ae(K,"H264");if(A){let Se=me.slice(0),ee=new RegExp(tr+"(\\d+) apt=(\\d+)"),J;for(J=0;J<K.length;++J){let We=K[J].match(ee);We&&We.length===3&&Se.includes(We[2])&&Se.push(We[1]);}let se=new RegExp("a=(rtpmap|rtcp-fb|fmtp):(\\d+) .*");for(J=K.length;J--;){let We=K[J].match(se);We&&We.length===3&&Se.includes(We[2])&&K.splice(J,1);}De(K,"video",Se,[]);}else _&&De(K,"video",[],me),C&&ke(K,me);}function Oe(K){let me=Ae(K,"VP9");I&&De(K,"video",[],me);}function B(K){let me=Ae(K,"red");me.length>0&&De(K,"audio",[],me);}let Tt=T.split(oe);return (A||_||C)&&U(Tt),I&&Oe(Tt),H&&B(Tt),L&&Me(Tt),Tt.join(pe)}ui.patchLocalSDP=n;function r(T){return b$1.browserName()==="Firefox"&&Number(b$1.browserVersion())<60&&(T=T.replace("m=application 9 UDP/DTLS/SCTP webrtc-datachannel","m=application 9 DTLS/SCTP 5000").replace("a=sctp-port:5000","a=sctpmap:5000 webrtc-datachannel 256")),T}ui.patchRemoteSDP=r;function e(T){return T?`${T.type||"WEB_SOCKET"}_${T.id}`:"_"}ui.getPeerIdString=e;function t(T,_){return T&&T.id===_.id&&(T.type||"WEB_SOCKET")===(_.type||"WEB_SOCKET")}ui.comparePeerId=t;function i(T){return c(this,null,function*(){return !T||!T.getStats?Promise.resolve(null):T.getStats(null).then(_=>{let A=null,I=null;if(_.forEach(C=>{C.type==="transport"&&C.selectedCandidatePairId?I=_.get(C.selectedCandidatePairId):C.type==="candidate-pair"&&C.state==="succeeded"&&!I&&(!C.hasOwnProperty("selected")||C.selected)&&(I=C);}),I&&I.localCandidateId){let C=_.get(I.localCandidateId);C&&(A={type:C.candidateType,ip:C.ip||C.ipAddress,port:C.port||C.portNumber});}return A}).catch(()=>null)})}ui.getPeerConnectionHostInfo=i;let a=/^[0-9]+$/,o=/^([gu])([0-9]+)$/;function s(T,_){let A=String(T);return o.test(A)?(d.warn(`Already composite id [${T}] type supplied [${_}]`),A):_===z$1.GROUP?"g"+A:_===z$1.USER?"u"+A:(d.warn(`Unknown type [${_}] for id [${T}]`),A.match(a)?"u"+A:A)}ui.composeUserId=s;function p(T,_,A){let I=s(T,_);return u(I,A)}ui.composeParticipantId=p;function u(T,_){return _?T+yt+gi+_:T}ui.compose=u;function m(T){return p(T.id,T.idType||z$1.USER,T.deviceIdx||0)}ui.composeId=m;function E(T){return T.participant?m(T.participant):p(T.participantId,T.participantType||z$1.USER,T.deviceIdx||0)}ui.composeMessageId=E;function P(T){let _=String(T),A=_.match(o);return A?{id:Number(A[2]),type:A[1]==="g"?z$1.GROUP:z$1.USER}:(d.warn(`Unsupported compositeId [${T}]`),{id:Number(_),type:z$1.USER})}ui.decomposeId=P;function k(T){let _=T.split(yt+gi);return {compositeUserId:_[0],deviceIdx:_.length>1?parseInt(_[1],10):0}}ui.decomposeParticipantId=k;function D(){var H,oe;let T=(oe=(H=window.crypto)==null?void 0:H.randomUUID)==null?void 0:oe.call(H);if(T)return T;let _="0123456789abcdefghijklmnopqrstuvwxyz".split(""),A=new Array(36),I=0,C,L;for(L=0;L<36;L++)L===8||L===13||L===18||L===23?A[L]="-":L===14?A[L]="4":(I<=2&&(I=33554432+Math.random()*16777216|0),C=I&15,I=I>>4,A[L]=_[L===19?C&3|8:C]);return A.join("")}ui.uuid=D;function q(T,_){let A;function I(){let C=this,L=arguments;A&&window.clearTimeout(A),A=window.setTimeout(()=>{T.apply(C,L);},_);}return I}ui.throttle=q;function j(T){if(!window.BigInt)return null;let _="",A=T.split(`
`);for(let L of A)if(L.startsWith("a=fingerprint")){let H=L.split(" ");if(H.length===2){_=H[1];break}}if(!_)return BigInt(-1);let I=_.split(":"),C=BigInt(0);for(let L=Math.min(7,I.length-1);L>=0;L--){let H=BigInt(parseInt(I[L],16));C<<=BigInt(8),C|=H;}return BigInt.asIntN(64,C)}ui.sdpFingerprint=j;function Y(T){return c(this,null,function*(){return new Promise(_=>window.setTimeout(_,T))})}ui.delay=Y;function re(T,_,A){let I=[];return T.getSenders().forEach(C=>X(_,C,C.track,A,I)),I}ui.applySettings=re;function X(T,_,A,I,C){var L;if(T&&A&&A.kind==="video"){let H=A.getSettings();if(H){let oe=T.maxBitrateK?T.maxBitrateK*1024:null,pe=H.width,Me=H.height,Ge=pe&&Me&&T.maxDimension?Math.max(1,Math.max(pe,Me)/T.maxDimension):null,Ae=T.maxFramerate?T.maxFramerate:null;if(pe&&Me&&T.maxDimension&&T.maxDimension>Math.max(pe,Me)){let Oe=Math.round(pe*Me/256),B=(Math.round(Oe*sn/1e4)+1)*1e4;oe=oe===null?B:Math.min(B,oe);}let De=T.degradationPreference?T.degradationPreference:"balanced",ke=I[A.id];if(ke&&ke.bitrate===oe&&ke.scaleResolutionDownBy===Ge&&ke.maxFramerate===Ae&&ke.degradationPreference===De){C[A.id]=ke;return}C[A.id]={bitrate:oe,scaleResolutionDownBy:Ge,maxFramerate:Ae,degradationPreference:De};let U=_.getParameters();U.encodings||(U.encodings=[{}]),U.encodings.forEach(Oe=>{oe?Oe.maxBitrate=oe:delete Oe.maxBitrate,Ge?Oe.scaleResolutionDownBy=Ge:delete Oe.scaleResolutionDownBy,Ae?Oe.maxFramerate=Ae:delete Oe.maxFramerate;}),U.degradationPreference=De,(L=_.setParameters)==null||L.call(_,U);}}}ui.applyVideoTrackSettings=X;function _e(T,_){Array.isArray(_)||(_=[_]);for(let A of _)if(T.includes(A))return !0;return !1}ui.includesOneOf=_e;function Te(T){var _;return Object.entries(((_=T.participantState)==null?void 0:_.state)||{}).reduce((A,[I,C])=>(T.participantState&&(A[I]={ts:T.participantState.stateUpdateTs[I],state:C}),A),{})}ui.mapParticipantState=Te;function ct(T){let _=T.map(A=>({uid:A.externalId,mediaSettings:A.mediaSettings,status:A.status,muteStates:A.muteStates,unmuteOptions:A.unmuteOptions,participantState:A.participantState,markers:A.markers,movieShareInfos:A.movieShareInfos}));return l$1.filterObservers?_.filter(A=>!A.uid.observer):_}ui.mapSharedParticipants=ct;function pi(T,_){let A=Object.keys(T),I=Object.keys(_);if(A.length!==I.length)return !1;for(let C of A)if(!I.hasOwnProperty(C)||T[C].state!==_[C].state||T[C].ts!==_[C].ts)return !1;return !0}ui.isEqualParticipantState=pi;function Gt(T,_){let A=Object.keys(T),I=Object.keys(_);if(A.length!==I.length)return !1;for(let C of A)if(!_.hasOwnProperty(C)||T[C]!==_[C])return !1;return !0}ui.isObjectsEquals=Gt;function Z(T,_){if(T.length!==_.length)return !1;for(let A of T)if(_.indexOf(A)<0)return !1;return !0}ui.isArraysEquals=Z;function br(T){return !Object.keys(T).length}ui.isEmptyObject=br;function Mr(T,_){if(!T&&!_)return 0;if(!T||!_)return T?-1:1;return I(_.rank,T.rank)||I(T.ts,_.ts)||A(T,_);function A(C,L){let H={[z$1.USER]:0,[z$1.GROUP]:1},{compositeUserId:oe,deviceIdx:pe}=k(C.id),{compositeUserId:Me,deviceIdx:Ge}=k(L.id),{id:Ae,type:De}=P(oe),{id:ke,type:U}=P(Me);return I(H[De],H[U])||I(Ae,ke)||I(pe,Ge)}function I(C,L){return C<L?-1:C===L?0:1}}ui.participantMarkerCompare=Mr;function Ar(T,_){let A=Object.entries(T).filter(([,I])=>Array.isArray(_)?!_.includes(I):I!==_);return la(A)}ui.objectFilterOutValues=Ar;function Hi(T,_,A){let I=A;for(let C in T)T.hasOwnProperty(C)&&(I=_(I,T[C],C));return I}ui.objectReduce=Hi,ui.setImmediate=(()=>{let T=1,_={},A=null;return typeof MessageChannel!="undefined"&&(A=new MessageChannel,A.port1.onmessage=I=>{let C=I.data;_[C]&&(_[C](),delete _[C]);}),function(I){if(A&&document.visibilityState==="hidden"){let L=T;return T=T>=Number.MAX_SAFE_INTEGER?1:T+1,_[L]=I,A.port2.postMessage(L),()=>{_[L]&&delete _[L];}}let C=setTimeout(I,0);return ()=>clearTimeout(C)}})();function Dr(T){return T!==null&&typeof T=="object"&&!Array.isArray(T)}ui.isObject=Dr;})(ir||(ir={}));var R$1=ir;function ua(n,r){if(n.isAudioEnabled!==r.isAudioEnabled||n.isVideoEnabled!==r.isVideoEnabled||n.isScreenSharingEnabled!==r.isScreenSharingEnabled||n.isFastScreenSharingEnabled!==r.isFastScreenSharingEnabled||n.isAudioSharingEnabled!==r.isAudioSharingEnabled||n.isAnimojiEnabled!==r.isAnimojiEnabled||n.videoStreams.length!==r.videoStreams.length)return !1;for(let e of n.videoStreams)if(!r.videoStreams.find(t=>t.id===e.id&&t.source===e.source))return !1;return !0}function he(n){return Object.assign({isAudioEnabled:!1,isVideoEnabled:!1,isScreenSharingEnabled:!1,isFastScreenSharingEnabled:!1,isAudioSharingEnabled:!1,isAnimojiEnabled:!1,videoStreams:[]},n||{})}var ma=n=>n.stop(),zt=n=>n.getTracks().forEach(ma),ha=n=>n.getVideoTracks().forEach(ma);function bt(n,{width:r,height:e}){return n.applyConstraints({width:{max:r,ideal:r},height:{max:e,ideal:e}})}var F$1=class extends Error{constructor(e,t){super();this.name="HangupReason",this.code=t&&t.code||0,this.remote=t&&t.remote||!1,Object.values(O$1).indexOf(e)>-1?this.hangup=e:this.error=e;let i=[];this.error&&i.push("error"),this.remote&&i.push("remote"),this.code&&i.push(`code: ${this.code}`),t&&t.message&&i.push(`message: '${t.message}'`),this.message=e+(i.length?` (${i.join(", ")})`:""),Error.captureStackTrace&&Error.captureStackTrace(this,F$1);}};var Be=(i=>(i.audio="audio",i.video="video",i.screen="screen",i.audioshare="audioshare",i))(Be||{}),fi=class extends te{constructor(){super();this._stream=null;this._screenTrack=null;this._audioShareTrack=null;this._sendVideoTrack=null;this._cameraVideoTrack=null;this._mediaSettings=he();this._videoStatusOnScreenCapturingEnabled=!1;this._effect=null;this._sourceBusy=!1;this._animojiEnabled=!1;this._initDeviceChangeListener(),l$1.audioShare&&(this._audioShareTrack=this.getSilentAudioShareTrack());}request(){return c(this,arguments,function*(e=[de.AUDIO],t=!0){var s;if(this._stream)return;let i=e.includes(de.VIDEO),a=e.includes(de.AUDIO),o=e.includes(de.ANIMOJI);if(!b$1.isBrowserSupported())throw new F$1(ie.UNSUPPORTED);try{this._stream=yield b$1.getUserMedia(i,a,t),(s=this._cameraVideoTrack)==null||s.stop(),this._cameraVideoTrack=this._stream.getVideoTracks()[0],this._mediaSettings.isVideoEnabled=i&&this._stream.getVideoTracks().filter(p=>p.enabled).length>0||!1,this._mediaSettings.isAudioEnabled=a&&this._stream.getAudioTracks().filter(p=>p.enabled).length>0||!1,this._mediaSettings.isAnimojiEnabled=o&&!this._mediaSettings.isVideoEnabled||!1,this._animojiEnabled=o;}catch(p){throw new F$1(p)}})}getStream(){return this._stream}getScreenTrack(){return this._screenTrack}getSendVideoTrack(e=!1){return this._sendVideoTrack&&!e?this._sendVideoTrack:this._stream?this._stream.getVideoTracks()[0]:null}getSendAudioTrack(){var t;return ((t=this._stream)==null?void 0:t.getAudioTracks().find(i=>!i.contentHint))||null}get isAnimojiRequested(){return this._animojiEnabled&&!this._mediaSettings.isVideoEnabled}addTrackToPeerConnection(e,t,i,a){let o=this.getStream(),s=this.getSendAudioTrack(),p=this.getSendVideoTrack(i);if(!o||!s&&!p&&!t)throw new Error("No local stream found");if(s&&!t){if(a){let{codecs:u}=RTCRtpSender.getCapabilities("audio"),m="audio/red",E=48e3,P=u.findIndex(k=>k.mimeType===m&&k.clockRate===E);if(P>=0){let k=[];k.push(u[P]);for(let D=0;D<u.length;D++)D!==P&&k.push(u[D]);e.getTransceivers().forEach(D=>D.setCodecPreferences(k));}}e.addTrack(s,o);}p&&!t&&e.addTrack(p,o);}getMediaSettings(){return this._mediaSettings}changeDevice(e){return c(this,null,function*(){switch(e){case"videoinput":if(this._mediaSettings.isVideoEnabled)return this._changeVideoInput();break;case"audioinput":if(this._mediaSettings.isAudioEnabled)return this._changeAudioInput();break;default:return Promise.reject(ie.UNKNOWN)}})}stopVideoTrack(){var e;this._mediaSettings.isVideoEnabled&&(this._stopEffect(),ha(this._stream),(e=this._cameraVideoTrack)==null||e.stop());}setVideoStream(e,t){return c(this,null,function*(){return t?this._changeScreen(!1,!1,e):this._changeVideoInput(e)})}_initDeviceChangeListener(){if(!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices||!navigator.mediaDevices.addEventListener)return;let e=!1,t=!1,i=R$1.throttle(()=>{t&&this._changeVideoInput().catch(()=>{}),e&&this._changeAudioInput().catch(()=>{}),e=!1,t=!1;},1e3);this._onDeviceChange=()=>c(this,null,function*(){if(!this._stream)return;let a=b$1.getSavedMicrophone(),o=b$1.getSavedCamera(),s=a==null?void 0:a.deviceId,p=o==null?void 0:o.deviceId;if(!s&&!p)return;let u=yield navigator.mediaDevices.enumerateDevices();!e&&s&&(e=!u.find(m=>m.deviceId===s)),!t&&p&&(t=!u.find(m=>m.deviceId===p)),i();}),navigator.mediaDevices.addEventListener("devicechange",this._onDeviceChange);}_destroyDeviceChangeListener(){this._onDeviceChange&&navigator.mediaDevices.removeEventListener("devicechange",this._onDeviceChange);}_changeVideoInput(e=null,t){return c(this,null,function*(){var i;this._busy();try{let a=e?"stream":"video",o=e||(yield b$1._getUserVideo(!!this._effect));if((i=this._cameraVideoTrack)==null||i.stop(),this._cameraVideoTrack=o.getVideoTracks()[0],!this._stream)zt(o);else {l$1.consumerScreenTrack||(yield this._disableScreenCapture());let s=yield this._setEffect(this._effect,this._cameraVideoTrack);t&&(yield bt(s,t)),v$1.log(S$1.DEVICE_CHANGED,a),d.log("Video stream changed"),yield this._replaceLocalTrack(s),this._mediaSettings.isVideoEnabled=!0,this._triggerEvent("SOURCE_CHANGED",{kind:"video",mediaSettings:this._mediaSettings});}}catch(a){throw v$1.log(S$1.ERROR,"change_video"),d.warn("Camera change failed",a),a}finally{this._free();}})}setAudioStream(e){return c(this,null,function*(){return this._changeAudioInput(e)})}_busy(){if(this._sourceBusy)throw v$1.log(S$1.ERROR,"change_device"),d.warn("Device change failed: MediaSource is busy"),new Error("MediaSource is busy");this._sourceBusy=!0;}_free(){this._sourceBusy=!1;}_changeAudioInput(e=null){return c(this,null,function*(){this._busy();try{if(e=e||(yield b$1.getUserAudio()),!this._stream)zt(e);else {let t=e.getAudioTracks()[0];v$1.log(S$1.DEVICE_CHANGED,"audio"),d.log("Audio stream changed"),yield this._replaceLocalTrack(t),this._mediaSettings.isAudioEnabled=!0,this._triggerEvent("SOURCE_CHANGED",{kind:"audio",mediaSettings:this._mediaSettings});}}catch(t){throw v$1.log(S$1.ERROR,"change_audio"),d.error("Microphone change failed",t),t}finally{this._free();}})}_changeScreen(e,t,i){return c(this,null,function*(){this._busy();try{if(i=i||(yield b$1.getScreenMedia(e,t)),!this._stream)zt(i);else {let a=i.getVideoTracks()[0];if(a.addEventListener("ended",()=>{this._mediaSettings.isScreenSharingEnabled&&this.disableScreenCapturing();},!1),l$1.consumerScreenTrack||this._stopEffect(),v$1.log(S$1.DEVICE_CHANGED,"screen"),d.log("Screen capturing started"),this._screenTrack=a,this._mediaSettings.isScreenSharingEnabled=!0,this._mediaSettings.isFastScreenSharingEnabled=e,l$1.consumerScreenTrack||(this._videoStatusOnScreenCapturingEnabled=this._mediaSettings.isVideoEnabled,this._mediaSettings.isVideoEnabled=!0,this._sendVideoTrack=l$1.consumerScreenDataChannel?b$1.getBlackMediaTrack(l$1.videoMinWidth,l$1.videoMinHeight):a,yield this._replaceLocalTrack(a,this._sendVideoTrack)),i.getAudioTracks().length>0){let o=i.getAudioTracks()[0];o.contentHint="music",this._audioShareTrack=o,yield this._replaceLocalTrack(o),this._mediaSettings.isAudioSharingEnabled=!0;}t&&!this._mediaSettings.isAudioSharingEnabled&&d.debug("Audio share requested but not captured"),this._triggerEvent("SCREEN_STATUS",{track:a,mediaSettings:this._mediaSettings}),this._triggerEvent("SOURCE_CHANGED",{kind:"screen",mediaSettings:this._mediaSettings});}}catch(a){throw v$1.log(S$1.ERROR,"screen"),d.warn("Screen capturing failed",a),a}finally{this._free();}})}_disableScreenCapture(){return c(this,null,function*(){this._sendVideoTrack&&(this._sendVideoTrack.stop(),this._sendVideoTrack=null),this._screenTrack&&(this._screenTrack.stop(),this._screenTrack=null),yield this.stopAudioShareTrack(),this._mediaSettings.isScreenSharingEnabled&&(this._mediaSettings.isScreenSharingEnabled=!1,this._mediaSettings.isFastScreenSharingEnabled=!1,this._triggerEvent("SCREEN_STATUS",{mediaSettings:this._mediaSettings}),this._triggerEvent("SOURCE_CHANGED",{kind:"screen",mediaSettings:this._mediaSettings}));})}disableAudioShare(){return c(this,null,function*(){yield this.stopAudioShareTrack(),this._triggerEvent("SCREEN_STATUS",{mediaSettings:this._mediaSettings}),this._triggerEvent("SOURCE_CHANGED",{kind:"audioshare",mediaSettings:this._mediaSettings});})}stopAudioShareTrack(){return c(this,null,function*(){if(this._audioShareTrack){this._audioShareTrack.stop();let e=this.getSilentAudioShareTrack();yield this._replaceLocalTrack(e),this._mediaSettings.isAudioSharingEnabled=!1;}})}getSilentAudioShareTrack(){let e=b$1.getSilentMediaTrack();return e.contentHint="music",e.stop(),e}_replaceLocalTrack(e,t){return c(this,null,function*(){var a,o;if(!this._stream)return;let i=this._stream.getTracks().find(s=>s.kind===e.kind&&s.contentHint===e.contentHint);i?(i.stop(),(a=this._stream)==null||a.removeTrack(i),(o=this._stream)==null||o.addTrack(e),this._triggerEvent("TRACK_REPLACED",e,t)):(this._stream.addTrack(e),this._triggerEvent("TRACK_REPLACED",e,t));})}_setEffect(e,t){return c(this,null,function*(){if(!l$1.videoEffects)return t;try{return l$1.videoEffects.setEffect(e,t)}catch(i){return d.warn("Video effect failed",i),t}})}_stopEffect(){if(l$1.videoEffects)try{l$1.videoEffects.stopEffect();}catch(e){d.warn("Video effect failed",e);}}destroy(){var e;this._destroyDeviceChangeListener(),l$1.videoEffects&&(this._effect=null,l$1.videoEffects.destroy()),this._stream&&(zt(this._stream),this._stream=null),(e=this._cameraVideoTrack)==null||e.stop(),this._disableScreenCapture();}toggleScreenCapturing(e){return c(this,null,function*(){if(e.captureScreen){yield this._changeScreen(e.fastScreenSharing,e.captureAudio);return}return l$1.consumerScreenTrack?this._disableScreenCapture():(e.captureAudio||(yield this.disableAudioShare()),this._videoStatusOnScreenCapturingEnabled?this._changeVideoInput():this.toggleVideo(!1))})}disableScreenCapturing(){return c(this,null,function*(){return this.toggleScreenCapturing({captureScreen:!1,fastScreenSharing:!1,captureAudio:!1})})}toggleVideo(e){return c(this,null,function*(){var i;if(!this._stream)return;l$1.consumerScreenTrack||(yield this._disableScreenCapture()),(i=this._cameraVideoTrack)==null||i.stop();let t;if(e){let a=yield b$1._getUserVideo(!!this._effect);this._cameraVideoTrack=a.getVideoTracks()[0],t=yield this._setEffect(this._effect,this._cameraVideoTrack);}else t=b$1.getBlackMediaTrack(l$1.videoMinWidth,l$1.videoMinHeight),this._stopEffect();if(yield this._replaceLocalTrack(t),this._mediaSettings.isVideoEnabled=e,this._animojiEnabled){this._triggerEvent("ANIMOJI_STATUS",!e);return}this._triggerEvent("SOURCE_CHANGED",{kind:"video",mediaSettings:this._mediaSettings});})}toggleAudio(e){return c(this,null,function*(){if(!this._stream)return;let t;e?t=(yield b$1.getUserAudio()).getAudioTracks()[0]:t=b$1.getSilentMediaTrack(),yield this._replaceLocalTrack(t),this._mediaSettings.isAudioEnabled=e,this._triggerEvent("SOURCE_CHANGED",{kind:"audio",mediaSettings:this._mediaSettings});})}toggleAnimojiCapturing(e){this._animojiEnabled=e,this._mediaSettings.isVideoEnabled||this._triggerEvent("ANIMOJI_STATUS",e);}onAnimojiSender(e){this._mediaSettings.isAnimojiEnabled=e,this._triggerEvent("SOURCE_CHANGED",{kind:"video",mediaSettings:this._mediaSettings});}_setEffectResolution(e){return c(this,null,function*(){if(!l$1.videoEffects)return;let t=this._cameraVideoTrack;this._stopEffect(),yield bt(t,e);let i=yield this._setEffect(this._effect,t);yield this._replaceLocalTrack(i);})}setResolution(i){return c(this,arguments,function*({video:e,effect:t}){if(!l$1.consumerScreenTrack&&this._mediaSettings.isScreenSharingEnabled)return;if(!this._stream)throw new Error("Local stream not found");let a=this._stream.getVideoTracks()[0];if(!a)throw new Error("Local video track not found");if(a.enabled){if(!this._effect)return bt(a,e);if(t)return this._setEffectResolution(t)}})}updateNoiseSuppression(){return c(this,null,function*(){if(!this._stream||!this._mediaSettings.isAudioEnabled)return;let e=this._stream.getAudioTracks().find(t=>!t.contentHint);if(!e)throw new Error("Local audio track not found");if(e.enabled)return e.applyConstraints({noiseSuppression:l$1.noiseSuppression})})}videoEffect(e){return c(this,null,function*(){if(!l$1.videoEffects)throw new Error("Video Effects library is not set");if(!l$1.consumerScreenTrack&&this._mediaSettings.isScreenSharingEnabled)throw new Error("Can't apply effect to screensharing");if(v$1.log(S$1.DEVICE_CHANGED,`effect_${(e==null?void 0:e.effect)||"none"}`),!this._mediaSettings.isVideoEnabled){this._effect=e;return}if(this._stream&&e!==this._effect){let t=this._effect;this._effect=e;try{let i=new MediaStream([this._cameraVideoTrack.clone()]);return e?this._changeVideoInput(i,{width:l$1.videoEffectMaxWidth,height:l$1.videoEffectMaxHeight}):this._changeVideoInput(i)}catch(i){throw this._effect=t,i}}})}getAudioShareTrack(){return this._audioShareTrack}};var ar="_okcls_",Mt=(()=>{try{let n=Date.now().toString(),r=window.localStorage,e=!1;return r.setItem(n,n),e=r.getItem(n)===n,r.removeItem(n),e?r:null}catch(n){return null}})();function dn(n){let r=Mt?Mt.getItem(ar+n):null;if(r===null)return null;try{return JSON.parse(r)}catch(e){return null}}function ln(n,r){try{Mt&&Mt.setItem(ar+n,JSON.stringify(r));}catch(e){}}function pn(n){Mt&&Mt.removeItem(ar+n);}var rr;(t=>{function n(i){return dn(i)||null}t.get=n;function r(i,a){ln(i,a);}t.set=r;function e(i){pn(i);}t.remove=e;})(rr||(rr={}));var Qe=rr;var Dt=null,nr=null,Ri=[],Ci=[],Ti=[],Xe=null,Ze=null,dr=null,lr=!1,Pi=!1,Si,At,vi,or=null,sr="",Ei=[],cr=null,_a=navigator.appVersion,un=navigator.appName,Ce=navigator.userAgent,ut=(e=>(e.USER="user",e.ENVIRONMENT="environment",e))(ut||{});(r=>{function n(e){return Object.values(r).includes(e)}r.contains=n;})(ut||(ut={}));var pt=class{constructor(r,e=!1,t=l$1.videoMaxWidth,i=l$1.videoMaxHeight){let a=!1;if(r){a={noiseSuppression:l$1.noiseSuppression,echoCancellation:!0,autoGainControl:!0};let s;Ze&&(s=Ze.deviceId),typeof r=="string"&&(s=r),s&&(a.deviceId={exact:s});}let o=!1;if(e){o={width:{min:l$1.videoMinWidth,max:t,ideal:t},height:{min:l$1.videoMinHeight,max:i,ideal:i},aspectRatio:{ideal:l$1.videoAspectRatio},frameRate:{ideal:l$1.videoFrameRate}};let s;Xe&&(s=Xe.deviceId),typeof e=="string"&&(s=e),s&&(o.deviceId={exact:s}),l$1.videoFacingMode&&(o.facingMode={ideal:l$1.videoFacingMode},delete o.deviceId);}this.audio=a,this.video=o,this.needVideo=!!o;}getNative(){return Object.assign({},{audio:this.audio,video:this.video})}simplify(){return typeof this.video=="object"&&(this.video.width||this.video.height?(delete this.video.width,delete this.video.height):this.video.aspectRatio?delete this.video.aspectRatio:this.video.frameRate?delete this.video.frameRate:(this.video.deviceId||this.video.facingMode)&&(delete this.video.deviceId,delete this.video.facingMode)),typeof this.audio=="object"&&(this.audio.echoCancellation||this.audio.autoGainControl||this.audio.noiseSuppression?(delete this.audio.echoCancellation,delete this.audio.autoGainControl,delete this.audio.noiseSuppression):this.audio.deviceId&&delete this.audio.deviceId),this.video===!0&&this.audio===!0?this.video=!1:this.video===!1&&this.audio===!0?(this.audio=!1,this.video=this.needVideo):this.video===!0&&this.audio===!1&&(this.video=!1),this.video&&!Object.keys(this.video).length&&(this.video=!0),this.audio&&!Object.keys(this.audio).length&&(this.audio=!0),this}canSimplify(){let r=typeof this.video=="object"&&(this.video.width||this.video.height||this.video.aspectRatio||this.video.frameRate||this.video.facingMode||this.video.deviceId)||this.video;return !!(typeof this.audio=="object"&&(this.audio.deviceId||this.audio.noiseSuppression||this.audio.echoCancellation||this.audio.autoGainControl)||this.audio||r)}isVideo(){return !!this.video}isAudio(){return !!this.audio}},pr=class extends pt{constructor(e,t,i,a){super(!1,!0);this.captureController="CaptureController"in window?new CaptureController:null,typeof this.video=="object"?(delete this.video.deviceId,delete this.video.aspectRatio,delete this.video.frameRate,delete this.video.facingMode):this.video={},this.video.cursor="motion",this.video.width={max:e},this.video.height={max:t},this.video.frameRate=i,this.video.displaySurface=l$1.displaySurface,a&&(this.audio={noiseSuppression:!1,echoCancellation:!1,autoGainControl:!1});}getNative(){return Object.assign(super.getNative(),{systemAudio:"exclude",controller:this.captureController})}};function ga(){return c(this,null,function*(){Pi=!1,Dt=null,yield ur(),g$1.onDeviceChange();})}function ur(){return c(this,null,function*(){return Dt||(!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices?[]:(!nr&&navigator.mediaDevices.addEventListener&&(nr=R$1.throttle(ga,1e3),navigator.mediaDevices.addEventListener("devicechange",nr)),Dt=navigator.mediaDevices.enumerateDevices().then(n=>{Ri=n.filter(i=>i.kind==="videoinput"?(i.label&&(lr=!0),!0):!1),Ci=n.filter(i=>i.kind==="audioinput"?(i.label?Pi=!0:et.isMobile()&&et.browserName()==="Firefox"&&(Pi=lr),!0):!1),Ti=n.filter(i=>i.kind==="audiooutput");let r=Qe.get("videoinput"),e=Qe.get("audioinput"),t=Qe.get("audiooutput");return Xe=Ri.find(i=>i.deviceId===r)||null,Ze=Ci.find(i=>i.deviceId===e)||null,dr=Ti.find(i=>i.deviceId===t)||Ti[0]||null,Dt=Promise.resolve(n),n}).catch(()=>(Dt=null,[]))))})}function mn(n){if(Xe&&Ze)return;let r=(e,t)=>{var a;let i=(a=t.getSettings())==null?void 0:a.deviceId;return e.find(o=>o.deviceId===i||o.label===t.label)||null};n==null||n.getTracks().forEach(e=>{!Ze&&e.kind==="audio"?Ze=r(et.getMicrophones(),e):!Xe&&e.kind==="video"&&(Xe=r(et.getCameras(),e));});}function Jt(n,r){return c(this,null,function*(){d.debug("Try to get media",JSON.parse(JSON.stringify(n.getNative())));let e=et.hasPermissions(n.isVideo());!e&&!r&&g$1.onPermissionsRequested();try{let t=yield navigator.mediaDevices.getUserMedia(n.getNative());return e||(yield ga()),mn(t),t}catch(t){switch(d.error("getUserMedia error",t),t.name){case"PermissionDeniedError":case"PermissionDismissedError":case"NotAllowedError":case"SecurityError":case"DOMException":r=n.isVideo()?ie.CAMERA_PERMISSION:ie.MIC_PERMISSION;break;case"OverconstrainedError":case"TypeError":case"NotFoundError":r=ie.UNKNOWN;break;case"AbortError":case"NotReadableError":r=n.isVideo()?ie.CAMERA_ACCESS:ie.MIC_ACCESS;break}if(n.canSimplify())return Jt(n.simplify(),r);let i=r||ie.UNKNOWN;throw g$1.onPermissionsError(i,t),i}})}function hn(n){return c(this,null,function*(){var r;d.debug("Try to get screen",JSON.parse(JSON.stringify(n.getNative())));try{let e=yield navigator.mediaDevices.getDisplayMedia(n.getNative()),t=e==null?void 0:e.getVideoTracks()[0];if(t&&(d.debug("Got display media track",t.id),t.contentHint="text",n.captureController)){let i=(r=t.getSettings())==null?void 0:r.displaySurface;(i==="browser"||i==="window")&&n.captureController.setFocusBehavior("no-focus-change");}return e}catch(e){switch(e.name){case"PermissionDeniedError":case"NotAllowedError":case"SecurityError":throw ie.SCREEN_PERMISSION;default:throw ie.SCREEN_ACCESS}}})}function Ii(){return Ei.length||(Ei=(()=>{let n,r=!1,e=0,t="0",i=Ce.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)||[];if(/trident/i.test(i[1]))return n=/\brv[ :]+(\d+)/g.exec(Ce),["IE",n&&n[1]||"Unknown",r,e,t];if(i[1]==="Safari"){if(n=Ce.match(/\bEdge\/(\d+)/),n)return ["Edge",n[1]||"Unknown",r,e,t];if(n=Ce.match(/\bCriOS\/(\d+)/),n)return ["Chrome",n[1],!0,Number(n[1]),t];if(n=Ce.match(/\bFxiOS\/(\d+)/),n)return ["Firefox",n[1],!1,e,t];if(n=Ce.match(/\bYaBrowser\/(\d+)/),n)return ["Yandex",n[1],!1,e,t];if(n=Ce.match(/\bOPT\/(\d+)/),n)return ["Opera",n[1],!1,e,t]}if(i[1]==="Chrome"){if(r=!0,e=Number(i[2]),n=Ce.match(/\bOPR\/(\d+)/),n)return ["Opera",n[1]||"Unknown",r,e,t];if(n=Ce.match(/\bYaBrowser\/(\d+)/),n)return ["Yandex",n[1]||"Unknown",r,e,t];if(n=Ce.match(/\bSferum\/((\d+)(?:\.\d+)*)/),n)return ["Sferum",n[1]||"Unknown",r,e,t];if(n=Ce.match(/\bEdge?\/(\d+)/),n)return ["Edge",n[1]||"Unknown",r,e,t];if(typeof window.opr!="undefined"&&/^(.+\.)?ok.ru$/.test(window.location.host))return ["Opera","Hidden",r,e,t]}return n=Ce.match(/version\/(\d+)(?:(?:\.)(\d+))?/i),n&&n[2]!==void 0&&(t=n[2]),[i[2]?i[1]:un,n&&n[1]||i[2]||_a,r,e,t]})()),Ei}var et;(A=>{function n(){return c(this,null,function*(){let I=()=>{_e(),document.removeEventListener("click",I),document.removeEventListener("touchstart",I);};return document.addEventListener("click",I),document.addEventListener("touchstart",I),ur()})}A.init=n;function r(){return Ri}A.getCameras=r;function e(){return Ci}A.getMicrophones=e;function t(){return Ti}A.getOutput=t;function i(){return Ri.length>0}A.hasCamera=i;function a(){return Ci.length>0}A.hasMicrophone=a;function o(){return Xe}A.getSavedCamera=o;function s(){return Ze}A.getSavedMicrophone=s;function p(){return dr}A.getSavedOutput=p;function u(){return l$1.videoFacingMode}A.getVideoFacingMode=u;function m(){return lr}A.hasCameraPermission=m;function E(){return Pi}A.hasMicrophonePermission=E;function P(I=!1){return E()?i()&&I?m():!0:!1}A.hasPermissions=P;function k(I=!1,C=!0,L=!0){return c(this,null,function*(){let H=a()&&C,oe=i()&&I,pe;if(!H&&!oe)pe=new MediaStream;else try{pe=yield Jt(new pt(H,oe));}catch(Me){pe=new MediaStream;}return !pe.getVideoTracks().length&&L&&pe.addTrack(Te()),!pe.getAudioTracks().length&&L&&pe.addTrack(_e()),pe})}A.getUserMedia=k;function D(I,C){return c(this,null,function*(){let L=I?l$1.fastScreenShareWidth:window.screen.width,H=I?l$1.fastScreenShareHeight:window.screen.height,oe=l$1.getScreenFrameRate(I);return hn(new pr(L,H,oe,C))})}A.getScreenMedia=D;function q(I=!1){return c(this,null,function*(){let C=I?l$1.videoEffectMaxWidth:l$1.videoMaxWidth,L=I?l$1.videoEffectMaxHeight:l$1.videoMaxHeight;return Jt(new pt(!1,!0,C,L))})}A._getUserVideo=q;function j(I,C){return c(this,null,function*(){let L=(C==null?void 0:C.width)||l$1.videoMaxWidth,H=(C==null?void 0:C.height)||l$1.videoMaxHeight;return Jt(new pt(!1,I||!0,L,H))})}A.getUserVideo=j;function Y(I){return c(this,null,function*(){return Jt(new pt(I||!0,!1))})}A.getUserAudio=Y;function re(I,C){return c(this,null,function*(){let[L]=I.getVideoTracks();if(!L)throw new Error("Video track not found in stream");return bt(L,C)})}A.setResolution=re;function X(I,C){return c(this,null,function*(){let H=(yield ur()).find(oe=>oe.kind===I&&oe.deviceId===C);return H?(I==="videoinput"?Xe=H:I==="audioinput"?Ze=H:I==="audiooutput"&&(dr=H),Qe.set(I,C),H):null})}A._saveDeviceId=X;function _e(){if(!vi||vi.readyState==="ended"){let I=ui(),C=I.createMediaStreamDestination(),L=I.createGain();L.gain.value=1e-5,L.connect(C),L.connect(I.destination);let H=I.createOscillator();H.type="sine",H.frequency.value=0,H.connect(L),H.start(),vi=C.stream.getAudioTracks()[0];}return Object.assign(vi.clone(),{enabled:!1})}A.getSilentMediaTrack=_e;function Te(I=l$1.videoMinWidth,C=l$1.videoMinHeight){At||(At=document.createElement("canvas")),At.width=I,At.height=C;let L=At.getContext("2d");return L.rect(0,0,I,C),L.fillStyle="black",L.fill(),(!Si||Si.readyState==="ended")&&(Si=At.captureStream(l$1.videoFrameRate).getVideoTracks()[0]),Object.assign(Si.clone(),{enabled:!1})}A.getBlackMediaTrack=Te;function ct(){if(Hi()==="Edge"&&Number(Gi())<70)return !1;try{let I=window;return navigator.mediaDevices&&navigator.mediaDevices.getUserMedia&&I.RTCPeerConnection&&I.RTCIceCandidate&&I.RTCSessionDescription&&I.HTMLCanvasElement&&I.HTMLCanvasElement.prototype.captureStream&&I.RTCRtpSender&&I.RTCRtpSender.prototype.replaceTrack&&I.RTCRtpSender.prototype.getParameters&&navigator.sendBeacon&&!0||!1}catch(I){return !1}}A.isBrowserSupported=ct;function pi(){return !!navigator.mediaDevices.getDisplayMedia}A.isScreenCapturingSupported=pi;function Gt(){let I=A.browserName()==="Safari"&&A.browserVersion()==="15"&&A.browserSubVersion()==="1",C=A.browserName()==="Opera"&&A.os()==="Windows";return I||C}A.isBrokenH264=Gt;function Z(){return !(A.baseChromeVersion()&&A.isMobile())}A.canPreferH264=Z;function br(){var I;return ((I=window.RTCRtpTransceiver)==null?void 0:I.prototype)&&"setCodecPreferences"in window.RTCRtpTransceiver.prototype}A.canPreferRed=br;function Mr(){return sr||(sr=(()=>{let I={Windows:/Win/,Android:/Android/,OpenBSD:/OpenBSD/,SunOS:/SunOS/,Linux:/(Linux|X11)/,iPad:/(iPad)/,iPhone:/(iPhone)/,iPod:/(iPod)/,MacOS:/(MacPPC|MacIntel|Mac_PowerPC|Macintosh|Mac OS X)/,QNX:/QNX/,UNIX:/UNIX/,BeOS:/BeOS/,OS2:/OS\/2/,Bot:/(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/};for(let C in I)if(I.hasOwnProperty(C)&&I[C].test(Ce))return C;return "Unknown"})()),sr}A.os=Mr;function Ar(){return or===null&&(or=/Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(_a)),or}A.isMobile=Ar;function Hi(){return Ii()[0]}A.browserName=Hi;function Gi(){return Ii()[1]}A.browserVersion=Gi;function Dr(){return Ii()[3]}A.baseChromeVersion=Dr;function ui(){return cr||(cr=new(window.AudioContext||window.webkitAudioContext)),cr}A.getAudioContext=ui;function T(){return Ii()[4]}A.browserSubVersion=T;function _(){return A.baseChromeVersion()>=105&&!A.isMobile()}A.isAudioShareSupported=_;})(et||(et={}));var b$1=et;var Fe=class extends Ne{init(r){return c(this,null,function*(){d.debug("WebCodecsDecoder started"),yield this._createWorker('"use strict";var exports=(()=>{var s=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var m=Object.getOwnPropertyNames;var b=Object.prototype.hasOwnProperty;var E=(o,e)=>{for(var t in e)s(o,t,{get:e[t],enumerable:!0})},g=(o,e,t,c)=>{if(e&&typeof e=="object"||typeof e=="function")for(let r of m(e))!b.call(o,r)&&r!==t&&s(o,r,{get:()=>e[r],enumerable:!(c=f(e,r))||c.enumerable});return o};var D=o=>g(s({},"__esModule",{value:!0}),o);var V={};E(V,{default:()=>R});var R=o=>{let e=null,t=!0;function c(){self.postMessage({type:"ready"})}function r(d,l,a,i=!1){if(!e||t!==a){if(!i){self.postMessage({type:"debug",message:"WebCodecsDecoder dropped frame - waiting for keyframe"});return}t=a,e?self.postMessage({type:"debug",message:`WebCodecsDecoder codec changed to ${a?"VP9":"VP8"}`}):(self.postMessage({type:"debug",message:`WebCodecsDecoder codec ${a?"VP9":"VP8"}`}),e=new VideoDecoder({output:n=>{let u=o?[n]:[];self.postMessage({type:"frame",data:n},u),n.close()},error:n=>{e&&e.state!=="closed"&&e.close(),e=null,self.postMessage({type:"frame",error:"WebCodecsDecoder failed, reinitialize: "+String(n)})}})),e.configure({codec:a?"vp09.00.50.08":"vp8"})}let p=new EncodedVideoChunk({type:i?"key":"delta",timestamp:d,data:l});e.decode(p)}self.onmessage=d=>{switch(d.data.type){case"init":c();break;case"frame":r(d.data.timestamp,d.data.data,d.data.isVP9,d.data.keyFrame);break}}};return D(V);})();\n',e=>{e.error?d.warn("WebCodecsDecoder",e.error):(r(e.data),e.data.close());},[b$1.baseChromeVersion()>=92||b$1.browserName()==="Safari"]);})}decodeFrame(r,e,t,i=!1){this._sendToWorker("frame",{timestamp:r,data:e.buffer,isVP9:t,keyFrame:i},[e.buffer]);}destroy(){this._removeWorker(),d.debug("WebCodecsDecoder destroyed");}static isBrowserSupported(){return "VideoDecoder"in window&&"Worker"in window&&"VideoFrame"in window}};var _n=1e3;function le(n,r,e=0){return r in n&&n[r]?n[r]:e}function fa(...n){return r=>{for(let e of n)if(e(r))return !0;return !1}}function tt(n,r){return e=>e[n]===r}function gn(n){return (r,e)=>r[n]-e[n]}function yi(n,r){return r.reduce((e,t)=>(e[t[n]]=t,e),{})}function fn(n){let r={},e=[];for(let t of n)r[t.id]||(r[t.id]=!0,e.push(t));return e}function mr(n){return Object.keys(n).filter(r=>n[r]!==void 0).map(r=>[r,n[r]]).reduce((r,e)=>(r[e[0]]=R$1.isObject(e[1])?mr(e[1]):e[1],r),{})}function Sn(n){let r=[];for(let e of n)e.forEach(t=>r.push(t));return r}function vn(n){return c(this,null,function*(){let r=[];return RTCRtpReceiver.prototype.getStats?(r.push(...n.getReceivers().map(e=>e.getStats())),r.push(...n.getSenders().map(e=>e.getStats()))):r.push(n.getStats()),Promise.all(r).then(Sn).then(fn)})}function En(n){let r=n.filter(tt("type","candidate-pair")).sort(gn("priority")).find(fa(tt("nominated",!0),tt("selected",!0)));if(!r)return {totalRoundTripTime:0,currentRoundTripTime:0,bytesSent:0,bytesReceived:0};let e={totalRoundTripTime:r.totalRoundTripTime||0,currentRoundTripTime:r.currentRoundTripTime||0,bytesSent:r.bytesSent,bytesReceived:r.bytesReceived},t=n.find(tt("id",r.remoteCandidateId));t&&Object.assign(e,{remote:{type:t.candidateType,address:t.ip||t.address,port:t.port,protocol:t.protocol}});let i=n.find(tt("id",r.localCandidateId));return i&&Object.assign(e,{local:{type:i.candidateType,address:i.ip||i.address,port:i.port,protocol:i.protocol,relayProtocol:i.relayProtocol,networkType:i.networkType}}),mr(e)}function In(n,r){let e=yi("id",n),t=n.filter(fa(tt("type","inbound-rtp"),tt("type","outbound-rtp")));b$1.browserName()==="Firefox"&&(t=Object.values(t.reduce((a,o)=>{if(!a[o.ssrc])a[o.ssrc]=o;else {let s=Object.assign({},a[o.ssrc],o),p=a[o.ssrc].isRemote?o:a[o.ssrc];s.id=p.id,s.type=p.type,delete s.isRemote,delete s.remoteId,a[s.ssrc]=s;}return a},{})));let i={};if(b$1.browserName()==="Safari"){let a=n.filter(tt("type","track"));i=yi("trackIdentifier",a);}return t.map(a=>{let o=Number(a.ssrc),s=a.mediaType||a.kind,p=a.trackId,u=a.type,m=a.codecId;if(b$1.browserName()==="Safari"){let P=/^.+_([\d]+)$/.exec(a.id);if(P&&(o=parseInt(P[1],10)),s=a.id.indexOf("Audio")>0?"audio":"video",r[o]){let k=s+"-"+r[o];i[k]&&(p=i[k].id);}}if(!u||!o||!s)return null;let E={ssrc:o,type:u,kind:s,bytesReceived:le(a,"bytesReceived"),bytesSent:le(a,"bytesSent"),jitter:le(a,"jitter"),packetsLost:le(a,"packetsLost"),packetsReceived:le(a,"packetsReceived"),packetsSent:le(a,"packetsSent"),fractionLost:le(a,"fractionLost"),pliCount:le(a,"pliCount"),firCount:le(a,"firCount"),nackCount:le(a,"nackCount"),userId:r[o],freezeCount:le(a,"freezeCount"),totalFreezesDuration:le(a,"totalFreezesDuration")};if(s==="video"){let P=le(a,"framesDecoded"),k=le(a,"totalInterFrameDelay"),D=le(a,"totalSquaredInterFrameDelay");E.interframeDelayVariance=(D-k*k/P)/P;}if(s==="audio"&&(E.totalSamplesReceived=le(a,"totalSamplesReceived"),E.concealedSamples=le(a,"concealedSamples"),E.insertedSamplesForDeceleration=le(a,"insertedSamplesForDeceleration"),E.removedSamplesForAcceleration=le(a,"removedSamplesForAcceleration"),E.silentConcealedSamples=le(a,"silentConcealedSamples"),E.concealmentEvents=le(a,"concealmentEvents"),E.totalAudioEnergy=le(a,"totalAudioEnergy")),m&&e[m]){let P=e[m];E.clockRate=P.clockRate,E.mimeType=P.mimeType;}if(p&&e[p]){let P=e[p];E.frameHeight=P.frameHeight,E.frameWidth=P.frameWidth,E.framesDecoded=P.framesDecoded,E.framesReceived=P.framesReceived,E.framesDropped=P.framesDropped;}return mr(E)}).filter(a=>!!a)}function Tn(n,r){if(!r||!r.rtps||!n.rtps)return n;let e=yi("ssrc",n.rtps),t=yi("ssrc",r.rtps),i=(n.timestamp-r.timestamp)/1e3;return !e||!t||Object.keys(e).forEach(a=>{let o=e[a],s=t[a];if(!(!o||!s)){if(o.bytesReceived&&o.bytesReceived>s.bytesReceived&&(o.bandwidth=Math.round((o.bytesReceived-s.bytesReceived)/i)),o.bytesSent&&o.bytesSent>s.bytesSent&&(o.bandwidth=Math.round((o.bytesSent-s.bytesSent)/i)),o.packetsReceived)if(o.packetsReceived>s.packetsReceived||o.packetsLost>s.packetsLost){let p=o.packetsLost-s.packetsLost,u=o.packetsReceived-s.packetsReceived;o.packetLoss=parseFloat((100*p/(p+u)).toFixed(2));}else o.packetLoss=0;if(o.freezeCount>s.freezeCount&&(o.freezeCountDelta=o.freezeCount-s.freezeCount),o.totalFreezesDuration>s.totalFreezesDuration){let p=Math.round(o.totalFreezesDuration-s.totalFreezesDuration);o.totalFreezesDurationDelta=p;}o.framesDropped&&s.framesDropped&&o.framesDropped>s.framesDropped&&(o.framesDroppedDelta=parseFloat(((o.framesDropped-s.framesDropped)/i).toFixed(0)));}}),n}function Yt(t,i){return c(this,arguments,function*(n,r,e={}){let a=yield vn(n),o={timestamp:Date.now(),transport:En(a),rtps:In(a,e)};return r?Tn(o,r):(yield R$1.delay(_n),Yt(n,o,e))})}function Ve(n){performance.clearMarks(n),performance.mark(n);}function hr(n){performance.clearMarks(n);}function it(n){let r=performance.getEntriesByName(n)[0];if(typeof r=="undefined")return null;let e=Math.round(performance.now()-r.startTime);return performance.clearMarks(n),e}function kt(n){return `${S$1.SCREENSHARE_FIRST_FRAME}_${Rn(n)}`}function Rn(n){return typeof n=="string"?n:JSON.stringify(n)}var je=class{constructor(){this._eventualLogs=new Set;}static create(){je._instance=new je;}static logCallStat(r){var e;if((e=je._instance)!=null&&e._eventualLogs.size){for(let t of je._instance._eventualLogs)Object.assign(t,{call_topology:r.call_topology,local_address:r.local_address,local_connection_type:r.local_connection_type,network_type:r.network_type,remote_address:r.remote_address,remote_connection_type:r.remote_connection_type,rtt:r.rtt,transport:r.transport}),v$1.logCustom(S$1.CALL_EVENTUAL_STAT,t);je._instance._eventualLogs.clear();}v$1.logCustom("callStat",r);}static logEventualStat(r){var e;r.value===void 0&&(r.value=it(r.name)),r.value!==null&&((e=je._instance)==null||e._eventualLogs.add(r));}static destroy(){var r;(r=je._instance)==null||r._destroy(),je._instance=null;}_destroy(){this._eventualLogs.clear();}},ge=je;ge._instance=null;var bi=class{constructor(r){this._firstFrameReceived=!1;this._participantId=r;}measure(r,e){if(this._firstFrameReceived)return;this._firstFrameReceived=!0;let t=kt(this._participantId),i=it(t);i!==null&&ge.logEventualStat({name:S$1.SCREENSHARE_FIRST_FRAME,value:i,width:r,height:e});}};var Pn=65536,rt=class{constructor(r,e,t){this._chunks=[];this._participantId=r,this._onStream=e,this._onStat=t,this._statScreenShareFirstFrame=new bi(r);}appendChunk(r){let e=this._chunks.length;if(r.start)this._measureFreezeDuration(!1),this._measureFreezeDuration(!0),e&&(d.warn("[FrameBuilder] Cleanup buffer",Array.prototype.slice.call(this._chunks)),this._chunks=[]);else if(!e||(this._chunks[e-1].sequence+1)%Pn!==r.sequence){d.warn("[FrameBuilder] Got incorrect chunk");return}if(this._chunks.push(r),r.end){let t=this._processFrameData(),{width:i,height:a}=rt.getFrameSize(t);this._processFrame({timestamp:r.timestamp,frameData:t,isVP9:r.isVP9,keyframe:r.keyframe,width:i,height:a}),this._statScreenShareFirstFrame.measure(i,a);}}destroy(){hr(S$1.SCREENSHARE_FREEZE_DURATION),hr(kt(this._participantId)),this._chunks=[];}_processFrameData(){let r=this._chunks;this._chunks=[];let e=r.reduce((a,o)=>a+o.data.byteLength,0),t=new Uint8Array(e),i=0;for(let a of r)t.set(new Uint8Array(a.data),i),i+=a.data.byteLength;return t}static getFrameSize(r){let e={width:0,height:0},t=new bitBuffer.BitStream(r.buffer);t.bigEndian=!0,t.index+=2;let i=t.readBits(1),o=t.readBits(1)<<1|i;return o===3&&t.index++,t.readBits(1)===1||t.readBits(1)!==0||(t.index++,t.index++,t.index+=24,o>=2&&t.index++,t.readBits(3)!==7?(t.index++,(o===1||o===3)&&(t.index+=3)):(o===1||o===3)&&t.index++,e.width=t.readBits(16)+1,e.height=t.readBits(16)+1),e}static isBrowserSupported(){throw new Error("Method `isBrowserSupported` is not implemented")}_measureFreezeDuration(r){if(r){Ve(S$1.SCREENSHARE_FREEZE_DURATION);return}let e=it(S$1.SCREENSHARE_FREEZE_DURATION);e!==null&&e>1e3&&this._onStat({freeze_duration:e});}};var mt=class{constructor(r){this._onStream=r;}drawFrame(r){return c(this,null,function*(){throw new Error("Method `drawFrame` is not supported by this implementation")})}drawImage(r){return c(this,null,function*(){throw new Error("Method `drawImage` is not supported by this implementation")})}static isBrowserSupported(){throw new Error("Method `isBrowserSupported` is not implemented")}};var Ot=class extends mt{constructor(e){super(e);this._canvas=null;this._canvasContext=null;this._stream=null;this._track=null;d.debug("CanvasRenderer started"),this._useImageBitmap="ImageBitmap"in window;}_createStream(e,t){this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.width=e,this._canvas.height=t,this._canvas.style.pointerEvents="none",this._canvas.style.visibility="hidden",this._canvas.style.position="absolute",this._canvas.style.width="160px",this._canvas.style.height="90px",this._canvas.style.bottom="0",this._canvas.style.right="0",this._canvas.style.zIndex="5000",document.body.appendChild(this._canvas),this._useImageBitmap?this._canvasContext=this._canvas.getContext("bitmaprenderer"):this._canvasContext=this._canvas.getContext("2d"),this._stream=this._canvas.captureStream(0),this._track=this._stream.getVideoTracks()[0],this._track.contentHint="text");}_removeStream(){this._stream&&(this._stream.getTracks().forEach(e=>e.stop()),this._stream=null,this._track=null),this._canvasContext=null;try{this._canvas&&document.body.removeChild(this._canvas);}catch(e){}this._canvas=null;}_requestCanvasFrame(){this._track&&this._track.requestFrame?this._track.requestFrame():this._stream&&this._stream.requestFrame&&this._stream.requestFrame();}_drawImage(e){return c(this,null,function*(){this._track||(this._createStream(e.width,e.height),this._onStream(this._stream));let t=this._canvas;if(t.width=e.width,t.height=e.height,this._useImageBitmap){let i;e instanceof ImageBitmap?i=e:i=yield createImageBitmap(e,0,0,e.width,e.height),this._canvasContext.transferFromImageBitmap(i),i.close();}else {let i=this._canvasContext;i.clearRect(0,0,t.width,t.height),i.putImageData(e,0,0);}this._requestCanvasFrame();})}drawFrame(e){return c(this,null,function*(){let t="createImageBitmap"in e?yield e.createImageBitmap():yield createImageBitmap(e);yield this._drawImage(t);})}drawImage(e){return c(this,null,function*(){yield this._drawImage(e);})}destroy(){this._removeStream(),d.debug("CanvasRenderer destroyed");}static isBrowserSupported(){return ("CanvasCaptureMediaStream"in window||"CanvasCaptureMediaStreamTrack"in window)&&!(b$1.browserName()==="Safari"&&Number(b$1.browserVersion())===15)&&!(b$1.browserName()==="Firefox"&&Number(b$1.browserVersion())<60)}};var ht=class extends mt{constructor(e){super(e);d.debug("TrackGeneratorRenderer started"),this._generator=new MediaStreamTrackGenerator({kind:"video"}),this._writer=this._generator.writable.getWriter(),this._stream=new MediaStream([this._generator]),this._onStream(this._stream);}drawFrame(e){return c(this,null,function*(){yield this._writer.write(e);})}destroy(){this._writer.releaseLock(),this._generator.writable.close().then(()=>this._generator.stop()),d.debug("TrackGeneratorRenderer destroyed");}static isBrowserSupported(){return "VideoFrame"in window&&"MediaStreamTrackGenerator"in window&&Fe.isBrowserSupported()}};var wt=class extends rt{constructor(e,t,i){super(e,t,i);this._decoderReady=!1;this._decoderQueue=[];d.debug(`StreamBuilder started for participant [${e}]`),ht.isBrowserSupported()?this._renderer=new ht(t):this._renderer=new Ot(t),Fe.isBrowserSupported()?this._decoder=new Fe:this._decoder=new lt;let a=o=>c(this,null,function*(){"VideoFrame"in window&&o instanceof VideoFrame?yield this._renderer.drawFrame(o):yield this._renderer.drawImage(o);});this._decoder.init(a).then(()=>{this._decoderReady=!0,this._decodeQueue();});}_processFrame(e){!this._decoderReady||this._decoderQueue.length?(this._decoderQueue.push(e),this._decodeQueue()):this._decoder.decodeFrame(e.timestamp,e.frameData,e.isVP9,e.keyframe);}_decodeQueue(){if(!this._decoderReady)return;let e=this._decoderQueue;this._decoderQueue=[],e.forEach(t=>{this._decoder.decodeFrame(t.timestamp,t.frameData,t.isVP9,t.keyframe);});}destroy(){super.destroy(),this._decoder.destroy(),this._renderer.destroy(),d.debug(`StreamBuilder destroyed for participant ${this._participantId}`);}static isBrowserSupported(){return Ot.isBrowserSupported()||ht.isBrowserSupported()}};function Sa(n,r,e,t,i,a,o){let s=0;r&&(s|=1),e&&(s|=2),t&&(s|=4),o||(s|=8);let p=new ArrayBuffer(11),u=new DataView(p);if(u.setUint8(0,1),u.setUint16(1,i),u.setUint32(3,n),u.setUint8(7,a?1:0),u.setUint16(8,0),u.setUint8(10,s),!o)return p;let m=new Uint8Array(p.byteLength+o.byteLength);return m.set(new Uint8Array(p),0),m.set(new Uint8Array(o),p.byteLength),m.buffer}function va(n){let r=new DataView(n),e=r.getUint8(0),t=r.getUint16(1),i=r.getUint32(3),a=r.getUint8(7)===1,o=r.getUint16(8),s=r.getUint8(10),p=!!(s&1),u=!!(s&2),m=!!(s&4),E=!!(s&8);if(e!==1)throw new Error(`Unexpected protocol version. Got ${e}, expected 1`);return {timestamp:i,start:p,end:u,keyframe:m,sequence:t,isVP9:a,ssrc:o,eos:E,data:n.slice(11)}}function Ea(n){if(!n||!n.byteLength||n.byteLength!==4)return !1;let r=new DataView(n);return !(r.getUint8(0)!==1||r.getUint8(1)!==1||r.getUint16(2)!==0)}function Ia(n){if(!n||!n.byteLength||n.byteLength!==10)return null;let r=new DataView(n);if(r.getUint8(0)!==1||r.getUint8(1)!==2||r.getUint16(2)!==0)return null;let a=r.getUint16(4),o=r.getUint32(6);return {seq:a,ts2:o}}var yn=xr(2,15)-1,_r=1,bn=5,Mn=5;var Qt=class{constructor(r){this._queue=[];this._clearBufferTill=0;this._mediaSource=new MediaSource,this._codec=r;let e=()=>{this._mediaSource.removeEventListener("sourceopen",e),this._initBuffer(),this._handleQueue();};this._mediaSource.addEventListener("sourceopen",e,!1);}_handleQueue(){if(!this._sourceBuffer||this._sourceBuffer.updating||!this._queue.length)return;if(this._clearBufferTill&&this._sourceBuffer.buffered.length){let t=this._sourceBuffer.buffered.start(0);t<this._clearBufferTill&&(this._sourceBuffer.remove(t,this._clearBufferTill),d.debug(`[WebmBuilder] SourceBuffer cleanup from ${t} to ${this._clearBufferTill}`)),this._clearBufferTill=0;return}let r=this._queue;this._queue=[];let e=Qt._buildQueue(r);this._sourceBuffer.appendBuffer(e);}static _buildQueue(r){if(r.length){if(r.length===1)return build.build(r[0])}else return new Uint8Array;let e=r.reduce((a,o)=>a+o.countSize(),0),t=new Uint8Array(e),i=0;for(let a of r){let o=build.build(a);t.set(o,i),i+=o.byteLength;}return t}_initBuffer(){this._sourceBuffer=this._mediaSource.addSourceBuffer(`video/webm; codecs="${this._codec}"`),this._sourceBuffer.mode="sequence",this._sourceBuffer.addEventListener("updateend",()=>this._handleQueue());}changeType(r){var e;return this._codec=r,(e=this._sourceBuffer)==null?void 0:e.changeType(r)}append(r,e=!1){this._queue.push(r),e&&this._handleQueue();}cleanup(){var a,o,s;((a=this._mediaSource)==null?void 0:a.readyState)==="open"&&((o=this._sourceBuffer)==null||o.abort());let r=(s=this._sourceBuffer)==null?void 0:s.buffered,e=r==null?void 0:r.length;if(!e)return;let t=r.start(0),i=Math.max(0,r.end(e-1)-bn);i-t>Mn&&(this._clearBufferTill=i);}destroy(){this._queue=[],this._mediaSource.readyState==="open"&&(this._sourceBuffer.abort(),this._mediaSource.endOfStream()),this._sourceBuffer=null,this._clearBufferTill=0;}get codec(){return this._codec}get mediaSource(){return this._mediaSource}get buffered(){var r;return (r=this._sourceBuffer)==null?void 0:r.buffered}},Pe=class extends rt{constructor(e,t,i){super(e,t,i);this._video=null;this._stream=null;this._earliestTimestamp=0;this._clusterStartTime=0;this._lastFrameTimestamp=0;d.debug(`[WebmBuilder] started for participant [${e}]`);}static _intToU16BE(e){return new Uint8Array([e>>8,e])}static _genWebmHeader(){return build.element(build.ID.EBML,[build.element(build.ID.EBMLVersion,build.number(1)),build.element(build.ID.EBMLReadVersion,build.number(1)),build.element(build.ID.EBMLMaxIDLength,build.number(4)),build.element(build.ID.EBMLMaxSizeLength,build.number(8)),build.element(build.ID.DocType,build.string("webm")),build.element(build.ID.DocTypeVersion,build.number(2)),build.element(build.ID.DocTypeReadVersion,build.number(2))])}static _genSegmentHeader(e,t,i){let a=build.element(build.ID.Info,[build.element(build.ID.TimecodeScale,build.number(1e6)),build.element(build.ID.MuxingApp,build.string("vk-webm-builder")),build.element(build.ID.WritingApp,build.string("vk-webm-builder"))]),o=[build.element(build.ID.PixelWidth,build.number(e)),build.element(build.ID.PixelHeight,build.number(t))],s=build.element(build.ID.Tracks,build.element(build.ID.TrackEntry,[build.element(build.ID.TrackNumber,build.number(_r)),build.element(build.ID.TrackUID,build.number(_r)),build.element(build.ID.TrackType,build.number(1)),build.element(build.ID.FlagLacing,build.number(0)),build.element(build.ID.DefaultDuration,build.number(1e9)),build.element(build.ID.CodecID,build.string(`V_${i.toUpperCase()}`)),build.element(build.ID.Video,o)]));return build.unknownSizeElement(build.ID.Segment,[a,s])}static _genClusterHeader(e){return build.unknownSizeElement(build.ID.Cluster,[build.element(build.ID.Timecode,build.number(Math.round(e)))])}_createVideo(e){this._mediaBuffer=new Qt(e),this._video=document.createElement("video"),this._video.autoplay=!0,this._video.controls=!1,this._video.muted=!0,this._video.style.pointerEvents="none",this._video.style.visibility="hidden",this._video.style.position="absolute",this._video.style.width="160px",this._video.style.height="90px",this._video.style.bottom="0",this._video.style.right="0",this._video.style.zIndex="5000",this._video.src=URL.createObjectURL(this._mediaBuffer.mediaSource),document.body.appendChild(this._video);let t=()=>{if(this._video.src){d.warn(`[WebmBuilder] Video paused for participant [${this._participantId}], try to play again`);let i=this._video.seekable;i.length&&(this._video.currentTime=i.end(i.length-1)-.1),this._video.play().catch(()=>{});}};this._video.onpause=t,this._video.onwaiting=t,this._video.onstalled=t,this._video.onerror=()=>d.warn(`[WebmBuilder] Video Error for participant [${this._participantId}]`,this._video.error),this._stream=this._video.captureStream(),this._onStream(this._stream);}_processFrame(e){let t=e.isVP9?"vp9":"vp8";this._mediaBuffer?this._mediaBuffer.codec!==t&&this._mediaBuffer.changeType(t):this._createVideo(t);let i=e.timestamp;if(i<=this._lastFrameTimestamp&&(i=this._lastFrameTimestamp+10,d.debug(`[WebmBuilder] Fixup timestamp for participant [${this._participantId}]`)),this._lastFrameTimestamp=i,this._earliestTimestamp)i-=this._earliestTimestamp;else {if(!e.keyframe)return;this._earliestTimestamp=i,i=0;}if(e.keyframe){this._clusterStartTime=i,this._mediaBuffer.cleanup(),d.debug(`[WebmBuilder] Segment header for participant [${this._participantId}]`);let s=Pe._genWebmHeader();this._mediaBuffer.append(s);let p=Pe._genSegmentHeader(e.width,e.height,t);this._mediaBuffer.append(p);}let a=Math.round(i-this._clusterStartTime);if(a>yn&&(this._clusterStartTime=i,a=0),a===0){d.debug(`[WebmBuilder] Cluster header for participant [${this._participantId}]`);let s=Pe._genClusterHeader(this._clusterStartTime);this._mediaBuffer.append(s);}let o=build.element(build.ID.SimpleBlock,[build.vintEncodedNumber(_r),build.bytes(Pe._intToU16BE(a)),build.number((e.keyframe?1:0)<<7),build.bytes(e.frameData)]);this._mediaBuffer.append(o,!0);}destroy(){super.destroy(),this._video&&(this._video.onpause=null,this._video.onwaiting=null,this._video.onstalled=null,this._video.onerror=null,this._video.pause(),this._video.src="",document.body.removeChild(this._video)),this._mediaBuffer&&(this._mediaBuffer.destroy(),this._mediaBuffer=null),this._stream&&(this._stream.getTracks().forEach(e=>e.stop()),this._stream=null),d.debug(`[WebmBuilder] destroyed for participant [${this._participantId}]`);}static isBrowserSupported(){var e,t,i;return "captureStream"in((e=window.HTMLVideoElement)==null?void 0:e.prototype)&&((t=window.MediaSource)==null?void 0:t.isTypeSupported('video/webm; codecs="vp8"'))&&((i=window.MediaSource)==null?void 0:i.isTypeSupported('video/webm; codecs="vp9"'))}};var _t=class{constructor(r,e,t,i,a){this._participantIdRegistry=null;this._streamBuilders={};this._onStream=()=>{};this._onEos=()=>{};d.debug("ScreenCaptureReceiver started"),this._datachannel=r,this._participantIdRegistry=e,this._onStream=t,this._onEos=i,this._onStat=a,this._datachannel.onmessage=o=>this._onDataChannelMessage(o.data);}_onDataChannelMessage(r){var a,o;let e=va(r),t=(o=(a=this._participantIdRegistry)==null?void 0:a.getStreamDescription(e.ssrc))==null?void 0:o.participantId;if(!t){d.warn(`Participant id for ssrc ${e.ssrc} not found in registry`);return}if(e.eos){this.close(t),this._onEos(t);return}let i=this._streamBuilders[t];if(!i){let s=p=>this._onStream(t,p);l$1.screenShareWebmBuilder&&Pe.isBrowserSupported()?i=new Pe(t,s,this._onStat):i=new wt(t,s,this._onStat),this._streamBuilders[t]=i;}i.appendChunk(e);}close(r){let e=this._streamBuilders[r];e&&(e.destroy(),delete this._streamBuilders[r]);}destroy(){this._datachannel.onbufferedamountlow=null,this._datachannel.onmessage=null,this._onStream=()=>{},Object.values(this._streamBuilders).forEach(r=>r.destroy()),this._streamBuilders={},this._participantIdRegistry=null,d.debug("ScreenCaptureReceiver destroyed");}static isBrowserSupported(){return (Fe.isBrowserSupported()||lt.isBrowserSupported())&&(wt.isBrowserSupported()||Pe.isBrowserSupported())}};var An=1e3,xt=class extends Ne{constructor(e,t,i,a){super();this._video=null;this._imageCapture=null;this._canvas=null;this._canvasCtx=null;this._stream=null;this._track=null;this._frameReadTimeout=0;this._lastFrame=null;this._sourceTrack=e,this._onFrame=t,this._useCongestionControl=i,this._maxBitrate=a,this._useImageCapture="ImageCapture"in window&&"ImageBitmap"in window,(e.readyState!=="live"||!e.enabled||e.muted)&&(this._useImageCapture=!1);}_createDom(){this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.style.pointerEvents="none",this._canvas.style.visibility="hidden",this._canvas.style.position="absolute",this._canvas.style.width="160px",this._canvas.style.height="90px",this._canvas.style.bottom="0",this._canvas.style.right="160px",this._canvas.style.zIndex="5000",this._canvasCtx=this._canvas.getContext("2d"),document.body.appendChild(this._canvas)),!this._video&&!this._useImageCapture&&(this._video=document.createElement("video"),this._video.controls=!1,this._video.autoplay=!1,this._video.preload="auto",this._video.muted=!0,this._video.style.pointerEvents="none",this._video.style.visibility="hidden",this._video.style.position="absolute",this._video.style.width="160px",this._video.style.height="90px",this._video.style.bottom="0",this._video.style.right="0",this._video.style.zIndex="5000",document.body.appendChild(this._video));}_removeDom(){try{this._canvas&&document.body.removeChild(this._canvas),this._video&&document.body.removeChild(this._video);}catch(e){}this._canvasCtx=null,this._canvas=null,this._video=null;}_createStream(e){return c(this,null,function*(){if(!this._canvas)throw new Error("Canvas not found");if(!this._video&&!this._useImageCapture)throw new Error("Video element not found");return this._stream=this._canvas.captureStream(0),this._track=this._stream.getVideoTracks()[0],new Promise((t,i)=>{if(this._useImageCapture)this._imageCapture=new ImageCapture(e),t();else {let a=this._video;a.srcObject=new MediaStream([e]),a.onloadeddata=p=>t(),a.onerror=()=>i(new Error("Video element error"));let o=a.play(),s=()=>i(new Error("Autoplay is disabled"));o?o.catch(s):s();}})})}_removeStream(){var e;window.clearTimeout(this._frameReadTimeout),(e=this._lastFrame)==null||e.close(),this._stream&&(this._stream.getTracks().forEach(t=>t.stop()),this._stream=null,this._track=null),this._video&&(this._video.pause(),this._video.srcObject=null),this._imageCapture&&(this._imageCapture=null);}_drawFrameVideo(){if(!this._canvas||!this._canvasCtx||!this._video||!this._track)throw new Error("Fatal error");this._video.paused&&this._video.play();let e=this._video.videoWidth,t=this._video.videoHeight;return this._canvas.width=this._video.width=e,this._canvas.height=this._video.height=t,this._canvasCtx.clearRect(0,0,e,t),this._canvasCtx.drawImage(this._video,0,0,e,t),this._requestCanvasFrame(),this._canvasCtx.getImageData(0,0,e,t)}_getFrameBitmap(){return c(this,null,function*(){if(!this._imageCapture)throw new Error("Destroyed");return this._imageCapture.grabFrame()})}_drawFrameData(e){var a;if(!this._canvas||!this._canvasCtx||!this._track)throw new Error("Destroyed");let t=e.width,i=e.height;return this._canvas.width=t,this._canvas.height=i,this._canvasCtx.clearRect(0,0,t,i),this._canvasCtx.drawImage(e,0,0,t,i),this._requestCanvasFrame(),(a=this._canvasCtx)==null?void 0:a.getImageData(0,0,t,i)}_requestCanvasFrame(){this._track&&this._track.requestFrame?this._track.requestFrame():this._stream&&this._stream.requestFrame&&this._stream.requestFrame();}init(){return c(this,null,function*(){this._createDom();let e=this._sourceTrack.getSettings().width,t=this._sourceTrack.getSettings().height;d.debug(`LibVPxEncoder started ${e}x${t}, codec ${this.isVP9()?"VP9":"VP8"}`),yield this._createStream(this._sourceTrack),yield this._createWorker(`"use strict";var exports=(()=>{var b=Object.defineProperty;var R=Object.getOwnPropertyDescriptor;var x=Object.getOwnPropertyNames;var y=Object.prototype.hasOwnProperty;var V=(a,r)=>{for(var s in r)b(a,s,{get:r[s],enumerable:!0})},h=(a,r,s,i)=>{if(r&&typeof r=="object"||typeof r=="function")for(let e of x(r))!y.call(a,e)&&e!==s&&b(a,e,{get:()=>r[e],enumerable:!(i=R(r,e))||i.enumerable});return a};var M=a=>h(b({},"__esModule",{value:!0}),a);var F={};V(F,{default:()=>A});var A=(a,r,s,i)=>{let e;function m(t,o){return a({locateFile:r}).then(n=>{if(e=new n.VpxEncoder,e.debug(o),!e.init(t?n.VpxType.VP9:n.VpxType.VP8))throw self.postMessage({type:"log_error",message:"encoder-init-fail-libvpx"}),new Error("LibVPxEncoder failed to create");if(s){let d=Math.round(i/1e3);e.setTargetBitrate(d)}else e.setMaxQuantizer(10),e.setTargetBitrate(1024)})}function E(t,o,n,p){let d=e.allocateImage(t,o);if(!d){self.postMessage({type:"frame",error:"No buffer data"});return}d.set(new Uint8Array(n));let f=Math.round(performance.now()),u=150;if(!e.encode(f,u,p)){self.postMessage({type:"frame",error:"Encode failed"});return}let c=e.readFrame();if(!c){self.postMessage({type:"frame",error:"No encoded data"});return}e.readFrame()&&(self.postMessage({type:"debug",message:"LibVPxEncoder dropped frame"}),self.postMessage({type:"log_error",message:"LibVPxEncoder-drop"}));let l=new Uint8Array(c.byteLength);l.set(c),self.postMessage({type:"frame",frameType:p?"key":"delta",timestamp:f,duration:u,width:t,height:o,data:l.buffer},[l.buffer])}function g(t,o){let n=Math.round(t/1e3);e.setTargetBitrate(n)}self.onmessage=t=>{switch(t.data.type){case"init":m(t.data.isVP9,t.data.debug).then(()=>self.postMessage({type:"ready"})).catch(o=>self.postMessage({type:"error",error:String(o)}));break;case"frame":E(t.data.width,t.data.height,t.data.imageData,t.data.keyFrame);break;case"set_bitrate":g(t.data.bitrate,t.data.useCbr);break}}};return M(F);})();
`,i=>{var a;i.error?this._onFrame(null,i.error):this._onFrame({type:i.frameType,timestamp:i.timestamp,duration:i.duration,data:i.data,byteLength:(a=i.data)==null?void 0:a.byteLength,width:i.width,height:i.height});},[libvpx_1,libvpx_1.getUrl,this._useCongestionControl,this._maxBitrate],{isVP9:this.isVP9(),debug:d.enabled()});})}_encode(e,t){let i=e.data.buffer;this._sendToWorker("frame",{width:e.width,height:e.height,imageData:i,keyFrame:t},[i]);}_requestFrameVideo(e){let t=this._drawFrameVideo();this._encode(t,e);}_requestFrameBitmap(e){this._frameReadTimeout=window.setTimeout(()=>{if(this._lastFrame){let t=this._drawFrameData(this._lastFrame);this._encode(t,e);}else this._onFrame(null);},An),this._getFrameBitmap().then(t=>{var a;window.clearTimeout(this._frameReadTimeout),(a=this._lastFrame)==null||a.close(),this._lastFrame=t;let i=this._drawFrameData(t);this._encode(i,e);}).catch(()=>{});}requestFrame(e=!1){this._useImageCapture?this._requestFrameBitmap(e):this._requestFrameVideo(e);}setBitrate(e,t=!1){this._sendToWorker("set_bitrate",{bitrate:e,useCbr:t});}isVP9(){return !1}destroy(){this._removeWorker(),this._removeStream(),this._removeDom(),d.debug("LibVPxEncoder destroyed");}static isBrowserSupported(){return "WebAssembly"in window&&"Worker"in window&&("CanvasCaptureMediaStream"in window||"CanvasCaptureMediaStreamTrack"in window)}};var gt=class extends Ne{constructor(e,t,i,a,o,s){super();this._sourceTrack=e,this._onFrame=t,this._useCongestionControl=i,this._maxBitrate=a,this._useCbr=o,this._frameRate=s,this._trackProcessor=new MediaStreamTrackProcessor(e);}init(){return c(this,null,function*(){let e=this._sourceTrack.getSettings().width,t=this._sourceTrack.getSettings().height,i=this._trackProcessor.readable;d.debug(`WebCodecsEncoder started ${e}x${t}, codec ${this.isVP9()?"VP9":"VP8"}`),yield this._createWorker(`"use strict";var exports=(()=>{var b=Object.defineProperty;var C=Object.getOwnPropertyDescriptor;var T=Object.getOwnPropertyNames;var B=Object.prototype.hasOwnProperty;var _=(a,t)=>{for(var n in t)b(a,n,{get:t[n],enumerable:!0})},x=(a,t,n,i)=>{if(t&&typeof t=="object"||typeof t=="function")for(let r of T(t))!B.call(a,r)&&r!==n&&b(a,r,{get:()=>t[r],enumerable:!(i=C(t,r))||i.enumerable});return a};var I=a=>x(b({},"__esModule",{value:!0}),a);var O={};_(O,{default:()=>M});var M=()=>{let t,n,i,r,R,E,l=null,p=0,s=!1,d=0,g,V,c=!1;function h(e){t=e.readable,n=t.getReader(),i=e.width,r=e.height,R=e.isVP9,E=e.framerate,g=e.useCongestionControl,V=e.maxBitrate,g&&(d=V,c=e.useCbr),u(),self.postMessage({type:"ready"})}function y(e){p=self.setTimeout(()=>{l&&A(l,e)},1e3),!s&&(s=!0,n.read().finally(()=>{s=!1,self.clearTimeout(p)}).then(({done:o,value:m})=>{if(l==null||l.close(),l=null,!(o||!m)){if(!f){n.releaseLock(),t.cancel();return}l=m,A(m,e)}}))}function A(e,o){(e.codedWidth!==i||e.codedHeight!==r)&&(i=e.codedWidth,r=e.codedHeight,u()),f.encode(e,{keyFrame:o})}function u(){let e={framerate:E,codec:R?"vp09.00.50.08":"vp8",width:i,height:r,latencyMode:"realtime",bitrateMode:c?"constant":"variable"};d>0&&(e.bitrate=d),f.configure(e)}function F(e,o=!1){d=e,c=o,u()}let f=new VideoEncoder({output:e=>{let o;e.data?o=e.data:(o=new ArrayBuffer(e.byteLength),e.copyTo(o)),self.postMessage({type:"frame",frameType:e.type,timestamp:e.timestamp,duration:e.duration,width:i,height:r,data:o},[o])},error:e=>{self.postMessage({type:"frame",error:String(e)})}});self.onmessage=e=>{switch(e.data.type){case"init":h(e.data);break;case"frame":y(e.data.keyFrame);break;case"set_bitrate":F(e.data.bitrate,e.data.useCbr);break}}};return I(O);})();
`,a=>{var o;a.error?this._onFrame(null,a.error):this._onFrame({type:a.frameType,timestamp:a.timestamp,duration:a.duration,data:a.data,byteLength:(o=a.data)==null?void 0:o.byteLength,width:a.width,height:a.height});},[],{readable:i,width:e,height:t,isVP9:this.isVP9(),framerate:this._frameRate,useCongestionControl:this._useCongestionControl,maxBitrate:this._maxBitrate,useCbr:this._useCbr},[i]);})}requestFrame(e=!1){this._sendToWorker("frame",{keyFrame:e});}setBitrate(e,t){this._sendToWorker("set_bitrate",{bitrate:e,useCbr:t});}isVP9(){return !0}destroy(){this._removeWorker(),d.debug("WebCodecsEncoder destroyed");}static isBrowserSupported(){return "VideoEncoder"in window&&"Worker"in window&&"EncodedVideoChunk"in window&&"MediaStreamTrackProcessor"in window}};var Dn=2100,kn=600,On=1.2,Ra=.8,wn=2e3,xn=8e3,gr=8e3,Ln=16e3,Nn=4,Un=2e3,Mi=(t=>(t[t.NONE=0]="NONE",t[t.UP=1]="UP",t[t.DOWN=2]="DOWN",t))(Mi||{}),Xt=class{constructor(r,e,t,i,a,o){this._upPenalty=0;this._delayAvgShort=-1;this._delayAvgLong=-1;this._minDelay=Number.MAX_VALUE;this._maxDelay=0;this._largeDelayDuration=0;this._onCongestion=r,this._ccEnabled=i,this._minBitrate=e,this._maxBitrate=t,this._fastSharing=a,o>0?this._highDelayThreshold=o:this._highDelayThreshold=Dn,a&&(this._highDelayThreshold=kn),this._trendDelayThreshold=Math.round(this._highDelayThreshold/3),this._targetBitrate=this._maxBitrate,this._probing=!1;let s=Date.now();this._lastDown=0,this._lastUp=s,this._lastProbing=s,this._lastCheckDelay=0;}checkDelay(r,e,t){let i=Date.now();if(this._calcDelay(e,i),this._delayAvgShort<=0||this._delayAvgLong<=0||!this._ccEnabled)return;let a=0,o=this._delayAvgShort-this._delayAvgLong,s=Math.round(Math.abs(o)*100/this._delayAvgLong),p=o>40&&s>30&&this._delayAvgShort>this._trendDelayThreshold,u=this._delayAvgShort>this._highDelayThreshold;p||u?a=2:Math.abs(o)<40&&s<10&&!u&&(a=1);let m=Math.round(this._targetBitrate/1e3),E=t;r%10===0&&d.debug(`#${r}: cc: delay=${e} short=${this._delayAvgShort} long=${this._delayAvgLong} delta=${o} percent=${s} -> ${Mi[a]} tr=${m} br=${t}`);let P=i-this._lastDown;if(a===2&&P>wn){this._probing&&(this._upPenalty=Math.min(++this._upPenalty,Nn),this._probing=!1);let Y=Ra*E*1e3;if(Y>=this._targetBitrate&&(Y=this._targetBitrate*Ra),Y=Math.max(Y,this._minBitrate),Y<this._targetBitrate){let re=Math.round(Y/1e3),X=Math.round(this._upPenalty*gr/1e3);d.log(`#${r}: cc: delay=${e} short=${this._delayAvgShort} long=${this._delayAvgLong} delta=${o} percent=${s} -> ${Mi[a]}`),d.log(`#${r}: cc: DOWN delay=${e} bitrate=${E} target=${m} -> newBitrate=${re} penalty=${X}s`),this._setBitrate(Y,!0),this._targetBitrate=Y;}this._lastDown=i;}let k=i-this._lastUp,D=xn+this._upPenalty*gr;if(a===1&&k>D&&P>D){let Y=Math.min(this._targetBitrate*On,this._maxBitrate);if(Y>this._targetBitrate){let re=Math.round(Y/1e3),X=Math.round(this._targetBitrate/1e3),_e=Math.round(this._upPenalty*gr/1e3);d.log(`#${r}: cc: delay=${e} short=${this._delayAvgShort} long=${this._delayAvgLong} delta=${o} percent=${s} -> ${Mi[a]}`),d.log(`#${r}: cc: UP bitrate=${E} target=${X} -> newBitrate=${re} penalty=${_e}s`),this._setBitrate(Y,!1),this._targetBitrate=Y,this._probing=!0,this._lastProbing=i,this._lastUp=i;}}let q=i-this._lastProbing;this._probing&&q>Ln&&(this._probing=!1);let j=i-this._lastDown;this._upPenalty>0&&j>3*D&&(d.log(`#${r}: cc: UP reset penalty: oldPenalty=${this._upPenalty}`),this._upPenalty=0);}_setBitrate(r,e){this._fastSharing&&(e=!0),this._onCongestion(r,e);}_calcDelay(r,e){if(!(r<=0)){if(this._delayAvgShort===-1&&(this._delayAvgShort=r,this._delayAvgLong=r),this._delayAvgShort=Math.round((this._delayAvgShort*3+r)/4),this._delayAvgLong=Math.round((this._delayAvgLong*23+r)/24),r>0&&r<this._minDelay?this._minDelay=r:r>this._maxDelay&&(this._maxDelay=r),this._lastCheckDelay===0&&(this._lastCheckDelay=e),r>Un){let t=e-this._lastCheckDelay;this._largeDelayDuration+=t;}this._lastCheckDelay=e;}}reconfigure(r,e){this._minBitrate=r,this._maxBitrate=e;}getStat(){if(this._minDelay===Number.MAX_VALUE||this._maxDelay===0||this._delayAvgLong<=0)return null;let r={minDelay:this._minDelay,maxDelay:this._maxDelay,avgDelay:this._delayAvgLong,largeDelayDuration:this._largeDelayDuration};return this._minDelay=Number.MAX_VALUE,this._maxDelay=0,this._largeDelayDuration=0,r}};var Zt=class{constructor(r){this._size=0;this._head=0;this._tail=0;this._maxSize=r,this._buffer=new Array(r);}add(r,e,t,i,a){this._tail===this._head&&this._size>0&&(this._head=++this._head%this._maxSize);let o=this._tail;return this._buffer[this._tail]={seq:r,ts:e,size:t,sent:Date.now(),start:i,end:a,ts2:-1,recv:-1},this._tail=++this._tail%this._maxSize,this._size++,o}update(r,e){let t=this.get(r);return t===null?null:(t.ts2=e,t.recv=Date.now(),t)}get(r){let e=this._head;for(let t=0;t<this._maxSize;t++){if(r===this._buffer[e].seq)return this._buffer[e];if(e=++e%this._maxSize,e===this._tail)break}return null}getServerBitrateK(r){let e=0,t=0,i=-1,a=-1,o=this._tail;for(let s=0;s<this._maxSize;s++){o>0?--o:o=this._maxSize-1;let p=this._buffer[o];if(p===null||(a===-1&&(a=p.ts2,t=0),a>=0&&(t+=p.size),i=p.ts2,a-i>=r)||o===this._head)break}if(i>=0&&a>=0){let s=a-i;e=Math.round(s>0?t*8/s:0);}return e}getCurrentDelay(){let r=this._tail;for(let e=0;e<this._maxSize;e++){r>0?--r:r=this._maxSize-1;let t=this._buffer[r];if(t===null)break;if(t.recv>=0&&t.sent>=0)return t.recv-t.sent;if(r===this._head)break}return 0}getMaxBandwidth(){let r=0,e=0,t=-1,i=-1,a=this._tail;for(let o=0;o<this._maxSize;o++){if(a>0?--a:a=this._maxSize-1,i===-1&&this._buffer[a].end&&!this._buffer[a].start&&(i=this._buffer[a].ts2,e=0),t===-1&&i>=0&&this._buffer[a].start&&!this._buffer[a].end&&(t=this._buffer[a].ts2),t>=0&&i>=0){let s=i-t;r=s>0?e*8/s:0;break}if(i>=0&&(e+=this._buffer[a].size),a===this._head)break}return Math.round(r)}};var Fn=65536,Vn=50,jn=400,Hn=1e6,Gn=3e4,Ai=0,ft=class{constructor(r,e,t,i){this._destroyed=!1;this._needKeyframe=!0;this._frameNum=0;this._feedback=new Zt(1024);this._lastSharingStat=Date.now();this._congestionControlEnabled=!1;d.debug("ScreenCaptureSender started"),this.DATA_SIZE=l$1.consumerScreenDataChannelPacketSize-11,this._datachannel=e,this._signaling=t,this._fastSharing=i,this._congestionControlEnabled=l$1.screenShareCongestionControl||this._fastSharing,this._width=r.getSettings().width,this._height=r.getSettings().height;let{minBitrate:a,maxBitrate:o}=this._calcMinMaxBitrate(this._width,this._height),s=this._onCongestionCallback.bind(this);d.log(`ScreenCaptureSender: CongestionControl: enabled=${this._congestionControlEnabled} minBitrate=${Math.round(a/1e3)}k maxBitrate=${Math.round(o/1e3)}k delayThreshold=${l$1.screenShareCongestionControlThreshold}`),this._congestionControl=new Xt(s,a,o,this._congestionControlEnabled,this._fastSharing,l$1.screenShareCongestionControlThreshold);let p=(u,m)=>{if(!this._destroyed){if(!u){d.warn("requestFrame failed, keyFrame: "+this._needKeyframe,m),this._needKeyframe=!0,this._requestFrame();return}(u.width!==this._width||u.height!==this._height)&&(this._width=u.width,this._height=u.height,this._onResize(this._width,this._height)),this._send(u).catch(E=>{d.warn("sendFrame failed",E),this._needKeyframe=!0;}).finally(()=>{this._frameNum++,u.type==="key"&&d.debug(`#${this._frameNum}: sharing: send keyframe size=${Math.round(u.byteLength/1e3)}k`);let E=this._feedback.getCurrentDelay(),P=this._feedback.getServerBitrateK(2e3);E>0&&this._congestionControl.checkDelay(this._frameNum,E,P),this._requestFrame();}),this._sendSharingStat();}};if(gt.isBrowserSupported()){let u=this._fastSharing,m=l$1.getScreenFrameRate(this._fastSharing);this._encoder=new gt(r,p,this._congestionControlEnabled,o,u,m);}else this._encoder=new xt(r,p,this._congestionControlEnabled,o);this._datachannel.onmessage=u=>{Ea(u.data)&&(d.debug(`[${this._datachannel.label}] Requested keyframe`),this._needKeyframe=!0);let m=Ia(u.data);m!==null&&this._checkCcFeedback(m);},this._encoder.init().then(()=>this._requestFrame()).catch(u=>d.warn("ScreenCaptureSender init failed",u));}_requestFrame(){this._destroyed||(this._encoder.requestFrame(this._needKeyframe),this._needKeyframe=!1);}_wrapHeader(r,e,t,i,a){let o=Sa(r,e,t,i,Ai,this._encoder.isVP9(),a);return Ai=(Ai+1)%Fn,o}_stopPacket(){return this._wrapHeader(Date.now(),!1,!1,!1,null)}_send(r){return c(this,null,function*(){return new Promise((e,t)=>{this._sendChunk(r,0,e,t);})})}_sendChunk(r,e,t,i){if(!this._datachannel||this._datachannel.readyState!=="open"){i();return}let a=r.data.slice(e,e+this.DATA_SIZE),o=r.data.byteLength<=e+a.byteLength;this._feedback.add(Ai,r.timestamp,a.byteLength,!e,o);let s=this._wrapHeader(r.timestamp,!e,o,r.type==="key",a);this._datachannel.onbufferedamountlow=o?()=>{this._datachannel.bufferedAmount<=this._datachannel.bufferedAmountLowThreshold&&(this._datachannel.onbufferedamountlow=null,t());}:null;try{this._datachannel.send(s);}catch(p){d.warn("Error send data to DataChannel",p),i();return}o||R$1.setImmediate(()=>this._sendChunk(r,e+this.DATA_SIZE,t,i));}destroy(){this._datachannel.onbufferedamountlow=null,this._datachannel.onmessage=null,this._datachannel.readyState==="open"&&this._datachannel.send(this._stopPacket()),this._destroyed=!0,this._encoder.destroy(),d.debug("ScreenCaptureSender destroyed");}static isBrowserSupported(){return gt.isBrowserSupported()||xt.isBrowserSupported()}_onCongestionCallback(r,e){this._encoder.setBitrate(r,e);}_onResize(r,e){let{minBitrate:t,maxBitrate:i}=this._calcMinMaxBitrate(r,e),a=Math.round(t/1e3),o=Math.round(i/1e3);d.log(`cc: resize to ${r}x${e}, minBitrate=${a} maxBitrate=${o}`),this._congestionControl.reconfigure(t,i);}_calcMinMaxBitrate(r,e){(r===void 0||r<640)&&(r=640),(e===void 0||e<360)&&(e=360);let t=r*e/256,i=Math.min(Hn,Math.round(t*Vn)),a=Math.round(t*jn);return {minBitrate:i,maxBitrate:a}}_checkCcFeedback(r){this._feedback.update(r.seq,r.ts2)===null&&d.debug(`cc: update failed, seq=${r.seq}`);}_sendSharingStat(){let r=Date.now();if(r-this._lastSharingStat>Gn){let t=this._congestionControl.getStat();t!==null&&(d.debug(`cc: send stats: ${JSON.stringify(t)}`),this._signaling.reportSharingStat(t)),this._lastSharingStat=r;}}};var ae=class{static get sessionKey(){return ae._sessionKey}static set sessionKey(r){ae._sessionKey=r;}static get sessionSecretKey(){return ae._sessionSecretKey}static set sessionSecretKey(r){ae._sessionSecretKey=r;}static get accessToken(){return ae._accessToken}static set accessToken(r){ae._accessToken=r;}static isEmpty(){return !ae._sessionKey||!ae._sessionSecretKey}};var f=class{static set(r){r.hasOwnProperty("voiceParams")&&(Object.assign(f._params.voiceParams,r.voiceParams),delete r.voiceParams),r.hasOwnProperty("specListenerParams")&&(Object.assign(f._params.specListenerParams,r.specListenerParams),delete r.specListenerParams),r.hasOwnProperty("apiAuth")&&(ae.accessToken=r.apiAuth.accessToken,ae.sessionKey=r.apiAuth.sessionKey,ae.sessionSecretKey=r.apiAuth.sessionSecretKey),r.hasOwnProperty("api")&&(Object.assign(f._params.api,r.api),delete r.api),Object.assign(f._params,R$1.objectFilterOutValues(r,void 0));}static get(r){return f._params[r]}static get appName(){return "ok.calls.sdk.js"}static get appVersion(){return 1.1}static get sdkVersion(){return "2.8.2-beta.6"}static get debug(){}static get protocolVersion(){return f._params.joinFromMultipleDevices?6:5}static get platform(){return f._params.platform}static set platform(r){f._params.platform=r;}static get clientType(){return f._params.clientType}static set clientType(r){f._params.clientType=r;}static get externalUserType(){return f._params.externalUserType}static set externalUserType(r){f._params.externalUserType=r;}static get device(){return f._params.device}static get apiKey(){return f._params.apiKey}static get apiEnv(){return f._params.apiEnv}static get apiEndpoint(){switch(f.apiEnv){case"AUTO":case"PROD":return "https://api.mycdn.me";case"PROD_OK":return "https://api.ok.ru";case"TEST":return "https://apitest.ok.ru/api";case"VIDEOTEST":return "https://videotestapi.ok.ru/api";default:return f._params.apiEnv}}static get authToken(){return f._params.authToken}static set authToken(r){f._params.authToken=r;}static get anonymToken(){return f._params.anonymToken}static set anonymToken(r){f._params.anonymToken=r;}static get domain(){return f._params.domain}static get externalDomain(){return f._params.externalDomain}static get iceServers(){return f._params.iceServers}static set iceServers(r){f._params.iceServers=r;}static get wssBase(){return f._params.wssBase}static set wssBase(r){f._params.wssBase=r;}static get wssToken(){return f._params.wssToken}static set wssToken(r){f._params.wssToken=r;}static get signalingReconnectDelay(){return f._params.signalingReconnectDelay}static get signalingReconnectMaxDelay(){return f._params.signalingReconnectMaxDelay}static get signalingReconnectMaxCount(){return f._params.signalingReconnectMaxCount}static get waitConnectionDelay(){return f._params.waitConnectionDelay}static get waitResponseDelay(){return f._params.waitResponseDelay}static get waitMessageDelay(){return f._params.waitMessageDelay}static get waitAnotherTabDelay(){return f._params.waitAnotherTabDelay}static get debugLog(){return f._params.debugLog}static get forceRelayPolicy(){return f._params.forceRelayPolicy}static set forceRelayPolicy(r){f._params.forceRelayPolicy=r;}static get videoMinWidth(){return f._params.videoMinWidth}static get videoMaxWidth(){return f._params.videoMaxWidth}static set videoMaxWidth(r){f._params.videoMaxWidth=r;}static get videoMinHeight(){return f._params.videoMinHeight}static get videoMaxHeight(){return f._params.videoMaxHeight}static set videoMaxHeight(r){f._params.videoMaxHeight=r;}static get videoAspectRatio(){return f._params.videoAspectRatio}static get videoFrameRate(){return f._params.videoFrameRate}static get videoFacingMode(){return f._params.videoFacingMode||(b$1.isMobile()?"user":null)}static set videoFacingMode(r){f._params.videoFacingMode=r;}static get displaySurface(){return f._params.displaySurface}static get videoEffects(){return f._params.videoEffects}static set videoEffects(r){f._params.videoEffects=r;}static get videoEffectMaxWidth(){return f._params.videoEffectMaxWidth}static set videoEffectMaxWidth(r){f._params.videoEffectMaxWidth=r;}static get videoEffectMaxHeight(){return f._params.videoEffectMaxHeight}static set videoEffectMaxHeight(r){f._params.videoEffectMaxHeight=r;}static get useVmoji(){var r;return ((r=f._params.vmoji)==null?void 0:r.isBrowserSupported())||!1}static get vmoji(){return f._params.vmoji}static set vmoji(r){f._params.vmoji=r;}static get vmojiRenderingOptions(){return f._params.vmojiRenderingOptions||{}}static set vmojiRenderingOptions(r){f._params.vmojiRenderingOptions=r;}static get voiceParams(){return f._params.voiceParams}static get specListenerParams(){return f._params.specListenerParams}static get iceRestartWaitTime(){return f._params.iceRestartWaitTime}static get transportConnectionWaitTime(){return f._params.transportConnectionWaitTime}static get statisticsInterval(){return f._params.statisticsInterval}static set statisticsInterval(r){f._params.statisticsInterval=r;}static get networkStatisticsInterval(){return f._params.networkStatisticsInterval}static get perfStatReportEnabled(){return f._params.perfStatReportEnabled}static get callStatReportEnabled(){return f._params.callStatReportEnabled}static get producerNotificationDataChannel(){return f._params.producerNotificationDataChannel}static get producerCommandDataChannel(){return f._params.producerCommandDataChannel}static get consumerScreenDataChannel(){return f._params.consumerScreenDataChannel&&ft.isBrowserSupported()}static get producerScreenDataChannel(){return f._params.producerScreenDataChannel&&f.producerNotificationDataChannel&&_t.isBrowserSupported()}static get asrDataChannel(){return f._params.asrDataChannel&&f.producerNotificationDataChannel}static get consumerScreenDataChannelPacketSize(){return f._params.consumerScreenDataChannelPacketSize}static get screenShareWebmBuilder(){return f._params.screenShareWebmBuilder}static get noiseSuppression(){return f._params.noiseSuppression}static set noiseSuppression(r){f._params.noiseSuppression=r;}static get preferH264(){return f._params.preferH264}static get preferVP9(){return f._params.preferVP9}static get audioNack(){return f._params.audioNack}static get consumerScreenTrack(){return f._params.consumerScreenTrack&&f.consumerScreenDataChannel}static get producerScreenTrack(){return f._params.producerScreenTrack}static get movieShare(){return f._params.movieShare&&f.videoTracksCount>0}static get videoTracksCount(){return f.producerNotificationDataChannel?Number(f._params.videoTracksCount):0}static get breakVideoPayloadTypes(){return f._params.breakVideoPayloadTypes}static get filteredMessages(){return f._params.filteredMessages}static get useParticipantListChunk(){return f._params.useParticipantListChunk&&f.videoTracksCount>0}static get useRooms(){return f._params.useRooms}static get participantListChunkInitIndex(){var r;return (r=f._params.participantListChunkInitIndex)!=null?r:0}static get participantListChunkInitCount(){var r;return (r=f._params.participantListChunkInitCount)!=null?r:null}static get serverAudioRed(){return f._params.serverAudioRed&&b$1.canPreferRed()}static get p2pAudioRed(){return f._params.p2pAudioRed&&b$1.canPreferRed()}static get h264spsPpsIdrInKeyframe(){return f._params.h264spsPpsIdrInKeyframe}static get batchParticipantsOnStart(){return f._params.batchParticipantsOnStart}static get filterObservers(){return f._params.filterObservers}static get muteMode(){return f._params.muteMode}static get preserveAudioTracks(){return f._params.preserveAudioTracks}static get audioShare(){return b$1.isAudioShareSupported()&&f._params.audioShare}static get fastScreenShare(){return f._params.fastScreenShare}static get screenShareCongestionControl(){return f._params.screenShareCongestionControl}static get screenShareCongestionControlThreshold(){return f._params.screenShareCongestionControlThreshold}static get api(){return f._params.api}static get fastScreenShareWidth(){return f._params.fastScreenShareWidth}static get fastScreenShareHeight(){return f._params.fastScreenShareHeight}static getScreenFrameRate(r){return r?f._params.fastScreenShareFrameRate:f._params.screenFrameRate}},l$1=f;l$1._params={platform:"WEB",clientType:"PORTAL",externalUserType:"",device:"browser",apiKey:"",authToken:"",anonymToken:"",apiEnv:"AUTO",domain:"",externalDomain:"",iceServers:[],wssBase:"",wssToken:"",signalingReconnectDelay:1e3,signalingReconnectMaxDelay:5e3,signalingReconnectMaxCount:20,waitConnectionDelay:1e4,waitResponseDelay:1e4,waitMessageDelay:15e3,waitAnotherTabDelay:200,debugLog:!1,forceRelayPolicy:!1,videoMinWidth:428,videoMinHeight:240,videoMaxWidth:1280,videoMaxHeight:720,videoAspectRatio:16/9,videoFrameRate:25,screenFrameRate:15,videoFacingMode:null,displaySurface:"monitor",videoEffects:null,videoEffectMaxWidth:640,videoEffectMaxHeight:360,vmoji:null,vmojiRenderingOptions:null,iceRestartWaitTime:2e4,transportConnectionWaitTime:5e3,statisticsInterval:5e3,networkStatisticsInterval:2e4,perfStatReportEnabled:!0,callStatReportEnabled:!1,voiceParams:{smoothing:.8,minFreq:200,maxFreq:5e3,interval:500,threshold:.35,speakerLevelMultiplier:1.8},specListenerParams:{connectionTimeout:1e4,volumeTimeout:1e4},producerNotificationDataChannel:!0,producerCommandDataChannel:!0,consumerScreenDataChannel:!0,producerScreenDataChannel:!0,asrDataChannel:!1,consumerScreenDataChannelPacketSize:64*1024,screenShareWebmBuilder:!1,noiseSuppression:!0,preferH264:!1,preferVP9:!0,audioNack:!0,consumerScreenTrack:!0,producerScreenTrack:!0,videoTracksCount:30,movieShare:!1,filteredMessages:!0,useParticipantListChunk:!1,useRooms:!1,participantListChunkInitIndex:0,participantListChunkInitCount:null,serverAudioRed:!0,p2pAudioRed:!0,h264spsPpsIdrInKeyframe:!0,breakVideoPayloadTypes:!1,batchParticipantsOnStart:!0,joinFromMultipleDevices:!1,filterObservers:!1,muteMode:!1,preserveAudioTracks:!1,audioShare:!1,fastScreenShare:!1,screenShareCongestionControl:!1,screenShareCongestionControlThreshold:2100,api:{userIdsByOkBatchedTimeout:1e3},fastScreenShareFrameRate:24,fastScreenShareWidth:1280,fastScreenShareHeight:720};var Sr=(p=>(p.WAITING_HALL="WAITING_HALL",p.WAITING="WAITING",p.CONNECTING="CONNECTING",p.CONNECTED="CONNECTED",p.RECONNECT="RECONNECT",p.ERROR="ERROR",p.HANGUP="HANGUP",p.PERMISSIONS="PERMISSIONS",p))(Sr||{});function V$1(n,...r){let e=l$1.get(n);e&&setTimeout(e,0,...r);}function ce(n,r,...e){if(l$1.filterObservers){if(Array.isArray(r)){if(r=r.filter(t=>!t.observer),!r.length)return}else if(r.observer)return}V$1(n,r,...e);}function Ee(n){return Object.assign({},n)}function St(n){return n.slice()}var fr;($o=>{function n(h,y){V$1("onLocalStream",h,Ee(y));}$o.onLocalStream=n;function r(h,y){V$1("onScreenStream",h,Ee(y));}$o.onScreenStream=r;function e(h,y){V$1("onVmojiStream",h,Ee(y));}$o.onVmojiStream=e;function t(h,y){V$1("onLocalStreamUpdate",Ee(h),y);}$o.onLocalStreamUpdate=t;function i(h){V$1("onLocalStatus",h);}$o.onLocalStatus=i;function a(h,y){ce("onRemoteStream",h,y);}$o.onRemoteStream=a;function o(h,y){ce("onRemoteLive",h,y);}$o.onRemoteLive=o;function s(h,y){ce("onLocalLive",h,y);}$o.onLocalLive=s;function p(h,y){ce("onRemoteLiveUpdate",h,y);}$o.onRemoteLiveUpdate=p;function u(h,y){ce("onLocalLiveUpdate",h,y);}$o.onLocalLiveUpdate=u;function m(h,y){ce("onRemoteScreenStream",h,y);}$o.onRemoteScreenStream=m;function E(h,y){ce("onRemoteVmojiStream",h,y);}$o.onRemoteVmojiStream=E;function P(h,y,Q,we,Wt){ce("onConversation",h,Ee(y),Ee(Q),we,Wt);}$o.onConversation=P;function k(h){h&&V$1("onConversationParticipantListChunk",h);}$o.onConversationParticipantListChunk=k;function D(h,y,Q){ce("onRemoteMediaSettings",h,Ee(y),Q);}$o.onRemoteMediaSettings=D;function q(h,y){ce("onLocalMediaSettings",h,Ee(y));}$o.onLocalMediaSettings=q;function j(h,y){ce("onRemoteSharedMovieInfo",h,Ee(y));}$o.onRemoteSharedMovieInfo=j;function Y(h,y){ce("onRemoteSharedMovieStoppedInfo",h,Ee(y));}$o.onRemoteSharedMovieStoppedInfo=Y;function re(h,y){ce("onLocalSharedMovieInfo",h,Ee(y));}$o.onLocalSharedMovieInfo=re;function X(h,y){ce("onLocalSharedMovieStoppedInfo",h,Ee(y));}$o.onLocalSharedMovieStoppedInfo=X;function _e(h,y){ce("onParticipantAdded",h,y);}$o.onParticipantAdded=_e;function Te(h,y){ce("onParticipantJoined",h,y);}$o.onParticipantJoined=Te;function ct(h,y,Q){ce("onRemoteParticipantState",h,Ee(y),Q);}$o.onRemoteParticipantState=ct;function pi(h,y,Q=null){ce("onRemoteStatus",h,y,Q);}$o.onRemoteStatus=pi;function Gt(h,y,Q=null){ce("onParticipantStatus",h,y,Q);}$o.onParticipantStatus=Gt;function Z(){V$1("onPermissionsRequested");}$o.onPermissionsRequested=Z;function br(h,y){V$1("onPermissionsError",h,y);}$o.onPermissionsError=br;function Mr(h,y){ce("onRemoteRemoved",h,y);}$o.onRemoteRemoved=Mr;function Ar(h,y,Q){V$1("onCallState",h,y,Ee(Q));}$o.onCallState=Ar;function Hi(h,y){V$1("onDeviceSwitched",h,y);}$o.onDeviceSwitched=Hi;function Gi(h,y,Q,we=!1,Wt=!1,Wi=null,Ki=null,$a,kr,qa=null){let za=kr?St(kr):void 0;V$1("onMuteStates",Ee(h),St(y),St(Q),we,Wt,Wi,Ki,$a,za,qa);}$o.onMuteStates=Gi;function Dr(h,y){ce("onRolesChanged",h,St(y));}$o.onRolesChanged=Dr;function ui(h){V$1("onLocalRolesChanged",St(h));}$o.onLocalRolesChanged=ui;function T(h,y,Q,we){ce("onPinnedParticipant",h,y,Q,we);}$o.onPinnedParticipant=T;function _(h,y){V$1("onLocalPin",h,y);}$o.onLocalPin=_;function A(h){V$1("onOptionsChanged",St(h));}$o.onOptionsChanged=A;function I(){V$1("onCallAccepted");}$o.onCallAccepted=I;function C(){V$1("onRateNeeded");}$o.onRateNeeded=C;function L(h){ce("onSpeakerChanged",h);}$o.onSpeakerChanged=L;function H(h){V$1("onVolumesDetected",St(h));}$o.onVolumesDetected=H;function oe(h,y){V$1("onLocalVolume",h,y);}$o.onLocalVolume=oe;function pe(h,y){V$1("onJoinStatus",h,y);}$o.onJoinStatus=pe;function Me(h,y){V$1("onHangup",h,y);}$o.onHangup=Me;function Ge(h){V$1("onMultipartyChatCreated",Ee(h));}$o.onMultipartyChatCreated=Ge;function Ae(){V$1("onDeviceChange");}$o.onDeviceChange=Ae;function De(h){V$1("onFingerprintChange",h);}$o.onFingerprintChange=De;function ke(){V$1("onTokenExpired");}$o.onTokenExpired=ke;function U(h,y,Q=!1){V$1("onChatMessage",h,y,Q);}$o.onChatMessage=U;function Oe(h,y,Q=!1){V$1("onCustomData",h,y,Q);}$o.onCustomData=Oe;function B(h,y,Q,we,Wt,Wi,Ki=null){V$1("onRecordStarted",h,y,Q,we,Wt,Wi,Ki);}$o.onRecordStarted=B;function Tt(h=null){V$1("onRecordStopped",h);}$o.onRecordStopped=Tt;function K(h){V$1("onLocalNetworkStatusChanged",h);}$o.onLocalNetworkStatusChanged=K;function me(h){V$1("onNetworkStatusChanged",h);}$o.onNetworkStatusChanged=me;function Se(h,...y){V$1("onDebugMessage",h,...y);}$o.onDebugMessage=Se;function ee(h,y){let Q=Object.assign({},h,{memory:y});V$1("onStatistics",Q);}$o.onStatistics=ee;function J(){V$1("onAutoplayError");}$o.onAutoplayError=J;function se(h,y,Q){V$1("onChatRoomUpdated",h,y,Q);}$o.onChatRoomUpdated=se;function We(h){V$1("onRemoteMixedAudioStream",h);}$o.onRemoteMixedAudioStream=We;function xo(h){V$1("onJoinLinkChanged",h);}$o.onJoinLinkChanged=xo;function Lo(h){V$1("onRoomsUpdated",h);}$o.onRoomsUpdated=Lo;function No(h,y,Q,we){V$1("onRoomUpdated",h,y,Q,we);}$o.onRoomUpdated=No;function Uo(h){V$1("onRoomParticipantsUpdated",h);}$o.onRoomParticipantsUpdated=Uo;function Bo(h){V$1("onRoomSwitched",h);}$o.onRoomSwitched=Bo;function Fo(h){V$1("onRoomStart",h);}$o.onRoomStart=Fo;function Vo(h,y=null){V$1("onFeedback",h,y);}$o.onFeedback=Vo;function jo(h){V$1("onFeaturesPerRoleChanged",h);}$o.onFeaturesPerRoleChanged=jo;function Ho(h){V$1("onParticipantVmojiUpdate",h);}$o.onParticipantVmojiUpdate=Ho;function Go(h,y){V$1("onAsrStarted",h,y);}$o.onAsrStarted=Go;function Wo(){V$1("onAsrStopped");}$o.onAsrStopped=Wo;function Ko(h,y,Q,we){V$1("onAsrTranscription",h,y,Q,we);}$o.onAsrTranscription=Ko;})(fr||(fr={}));var g$1=fr;var Ca=(i=>(i.DEBUG="DEBUG",i.LOG="LOG",i.WARN="WARN",i.ERROR="ERROR",i))(Ca||{}),vr;(X=>{let n="📞",r=(_e,...Te)=>{g$1.onDebugMessage(_e,...Te);},e=!1,t=(_e,Te)=>(...ct)=>{_e(...ct),ca(Te,ct);},i=console.debug.bind(console,n),a=console.log.bind(console,n),o=console.warn.bind(console,n),s=console.error.bind(console,n),p=r.bind(null,"DEBUG"),u=r.bind(null,"LOG"),m=r.bind(null,"WARN"),E=r.bind(null,"ERROR");X.debug=p,X.log=u,X.warn=m,X.error=E;function j(){return e}X.enabled=j;function Y(_e){e=_e,l$1.debugLog&&er(),_e?(X.debug=l$1.debugLog?t(i,"DEBUG"):i,X.log=l$1.debugLog?t(a,"LOG"):a,X.warn=l$1.debugLog?t(o,"WARN"):o,X.error=l$1.debugLog?t(s,"ERROR"):s):(X.debug=l$1.debugLog?t(p,"DEBUG"):p,X.log=l$1.debugLog?t(u,"LOG"):u,X.warn=l$1.debugLog?t(m,"WARN"):m,X.error=l$1.debugLog?t(E,"ERROR"):E);}X.toggle=Y;function re(_e,...Te){switch(_e){case"DEBUG":(0, X.debug)(...Te);break;case"LOG":(0, X.log)(...Te);break;case"WARN":(0, X.warn)(...Te);break;case"ERROR":(0, X.error)(...Te);break}}X.send=re;})(vr||(vr={}));var d=vr;var Er=(t=>(t.USER="USER",t.ANONYM="ANONYM",t.GROUP="GROUP",t))(Er||{}),fe;(s=>{function n(p){return p.length?typeof p[0]=="object"?p:p.map(u=>r(u)):[]}s.fromIds=n;function r(p,u="USER"){return {id:p,type:u}}s.fromId=r;function e(p){return {id:p.id,type:p.type==="ANONYM"?"ANONYM":"USER"}}s.fromSignaling=e;function t(p){return `{"id":"${p.id}","type":"${p.type}"}`}s.toString=t;function i(p,u="USER"){return t(r(p,u))}s.fromIdToString=i;function a(p){try{return JSON.parse(p)}catch(u){throw new Error(`Failed to parse ExternalId from string '${p}'`)}}s.fromString=a;function o(p,u){return p.id===u.id&&p.type===u.type}s.compare=o;})(fe||(fe={}));var ue;(i=>{function n(a,o="USER",s=0){return {id:a,type:o,deviceIdx:s}}i.fromId=n;function r(a){return `{"id":"${a.id}","type":"${a.type}","deviceIdx":"${a.deviceIdx}"}`}i.toString=r;function e(a,o){return Object.assign({deviceIdx:o},fe.fromSignaling(a))}i.fromSignaling=e;function t(a){return a&&typeof a=="object"?a.deviceIdx:0}i.getDeviceIdx=t;})(ue||(ue={}));var Wn="kf";function Lt(n){return n.stopStream}function Ir(n){return n.keyFrameRequested}function Pa(n){if(Lt(n))return "ss";if(Ir(n))return Wn;let r="";return n.priority!==void 0&&(r+="p="+n.priority),n.width!==void 0&&n.height!==void 0&&(r!==""&&(r+=":"),r+="sz="+Math.round(n.width)+"x"+Math.round(n.height)),n.fit!==void 0&&(r!==""&&(r+=":"),r+="fit="+n.fit),r}var ei=(o=>(o.CAMERA="CAMERA",o.SCREEN="SCREEN",o.STREAM="STREAM",o.MOVIE="MOVIE",o.AUDIOSHARE="AUDIOSHARE",o.ANIMOJI="ANIMOJI",o))(ei||{}),ya="s",ba="m";function He(n){return n.participantId+(n.mediaType?yt+ya+n.mediaType:"")+(n.streamName?yt+ba+n.streamName:"")}function ti(n){let r=n.split(yt),e=r.shift();if(!e)throw new Error("Illegal stream description: "+n);let t=null,i,a=0;for(let s of r)switch(s.charAt(0)){case ya:t=Kn(s.slice(1));break;case ba:i=s.slice(1);break;case gi:a=Number.parseInt(s.slice(1),10);break;default:throw new Error("Unexpected parameter type "+s.charAt(0)+" in stream description "+n)}return {participantId:R$1.compose(e,a),mediaType:t,streamName:i}}function Kn(n){for(let r of Object.keys(ei))if(r===n)return ei[r];return null}function Tr(n,r){return n===null||r===null?n===null&&r===null:!(n.maxDimension!==r.maxDimension||n.maxBitrateK!==r.maxBitrateK||n.maxFramerate!==r.maxFramerate||n.degradationPreference!==r.degradationPreference)}function Di(n,r){return !(!Tr(n.camera,r.camera)||!Tr(n.screenSharing,r.screenSharing))}function Rr(n,r){return {camera:Object.assign({},n.camera,r.camera),screenSharing:Object.assign({},n.screenSharing,r.screenSharing)}}function Ma(n){try{return btoa(JSON.stringify(n))}catch(r){d.warn("WaitingParticipant: failed convert to string",n,r);}return null}function Aa(n){try{return JSON.parse(atob(n))}catch(r){d.warn("WaitingParticipant: failed convert from string",n,r);}return null}var Nt=(n,r)=>R$1.objectReduce(n,(e,t,i)=>(t===r&&e.push(i),e),[]);var Ut=class{constructor(r){this._fixNoPacketsApplied=!1;this._fixNoPacketsChecked=!1;this._fixTooManyPacketsApplied=!1;this._fixTooManyPacketsSucceeded=!1;this._fixTooManyPacketsFailed=!1;this._mediaSource=r;}_fixAudioDeviceNoPackets(r){if(!(this._fixNoPacketsApplied&&this._fixNoPacketsChecked)){if(this._fixNoPacketsApplied&&!this._fixNoPacketsChecked){this._fixNoPacketsChecked=!0,v$1.log(S$1.ERROR,`audio_device_recover_${r.bandwidth?"success":"fail"}`);return}!this._fixNoPacketsApplied&&!r.bandwidth&&(this._fixNoPacketsApplied=!0,v$1.log(S$1.ERROR,"audio_device_recover"),this._mediaSource.toggleAudio(!0));}}_fixAudioDeviceTooManyPackets(r){if(this._fixTooManyPacketsSucceeded||this._fixTooManyPacketsFailed)return;let e=75,t=Date.now();if(!this._lastPacketsSentTime)r.packetsSent>0&&(this._lastPacketsSentTime=t,this._lastPacketsSent=r.packetsSent);else if(t-this._lastPacketsSentTime>500){let i=(r.packetsSent-this._lastPacketsSent)*1e3/(t-this._lastPacketsSentTime);this._lastPacketsSentTime=t,this._lastPacketsSent=r.packetsSent,this._fixTooManyPacketsApplied?i>e?(d.log("Failed to fix RV"),v$1.log(S$1.ERROR,"audio_device_recover_rv_fail"),this._fixTooManyPacketsFailed=!0):t-this._fixTooManyPacketsTime>6e4&&(d.log("Fixed RV"),v$1.log(S$1.ERROR,"audio_device_recover_rv_success"),this._fixTooManyPacketsSucceeded=!0):i>e&&(this._fixTooManyPacketsApplied=!0,d.log("Trying to fix RV"),this._mediaSource.toggleAudio(!0),this._fixTooManyPacketsTime=t);}}fix(r){if(!this._mediaSource)return;let e=r.find(t=>t.kind==="audio");e&&(this._fixAudioDeviceNoPackets(e),this._fixAudioDeviceTooManyPackets(e));}};var ii=class{constructor(){this._output=null;this._volume=1;this._features={setSinkId:!!Audio.prototype.setSinkId};}add(r){this.destroy(),this._output={},this._output.audioTrack=r,this._initAudioElement();}remove(r){!this._output||this._output.audioTrack!==r||this.destroy();}get volume(){return this._volume}set volume(r){this._volume=Math.max(0,Math.min(1,r)),this._output&&this._output.audioElement&&(this._output.audioElement.volume=this._volume);}_initAudioElement(){var o;if(l$1.muteMode||!((o=this._output)!=null&&o.audioTrack))return;let r=b$1.browserName()!=="Safari"||b$1.isMobile(),e=document.createElement(r?"audio":"video");e.muted=!1,e.volume=this._volume,e.preload="auto";let t=()=>{d.warn("Error on play audio"),g$1.onAutoplayError();},i=s=>{e.srcObject=new MediaStream([s]),e.load();let p=e.play();p&&p.catch(t);},a=()=>{var p;d.debug("Recover audio playback");let s=(p=this._output)==null?void 0:p.audioTrack;s?i(s):d.warn("Broken audio track");};e.onpause=a,e.onstalled=a,e.onerror=a,i(this._output.audioTrack),this._output.audioElement=e;}_stopAudioElement(){var r,e,t;(r=this._output)!=null&&r.audioElement&&(this._output.audioElement.pause(),this._output.audioElement.srcObject=null),(t=(e=this._output)==null?void 0:e.audioTrack)==null||t.stop();}destroy(){this._output&&(this._stopAudioElement(),this._output=null);}changeOutput(){return c(this,null,function*(){var r,e,t;try{if(!this._features.setSinkId)throw new Error('Feature "setSinkId" is not supported');if(!((r=this._output)!=null&&r.audioElement))throw new Error("Audio Element is not initialized");let i=b$1.getSavedOutput();i&&(yield (t=(e=this._output.audioElement).setSinkId)==null?void 0:t.call(e,i.deviceId));}catch(i){throw v$1.log(S$1.ERROR,"change_output"),d.error("Output change failed",i),i}})}};var $n=90,qn=3,ri=class extends te{constructor(){super(...arguments);this._lastMemoryStat={percent:0,bytes:0};}onRemoteDataStats(e,t){this._calcMemory(),e.inbound.rtps.map(i=>{let a=typeof i.userId=="string"&&t[i.userId]||null;i.userId=a==null?void 0:a.externalId;}),g$1.onStatistics(e,this._lastMemoryStat);}_calcMemory(){var a;let e=(a=window==null?void 0:window.performance)==null?void 0:a.memory;if(!e||!e.usedJSHeapSize||!e.jsHeapSizeLimit)return;let t=Number((100*e.usedJSHeapSize/e.jsHeapSizeLimit).toFixed(2)),i=Number((e.usedJSHeapSize/1024/1024).toFixed(1));t>$n?d.warn(`High memory usage: ${t}% (${i} MiB)`):(!this._lastMemoryStat.percent||Math.abs(t-this._lastMemoryStat.percent)>=qn)&&(d.debug(`Memory usage: ${t}% (${i} MiB)`),this._lastMemoryStat.percent=t,this._lastMemoryStat.bytes=e.usedJSHeapSize);}};var zn=44100,Bt=class{constructor(r,e){this._analyser=null;this._gainNode=null;this._fftBins=null;this._mediaStreamSource=null;this._lastSmoothedLevel=0;this._trackId=r,this._stream=e;try{let t=b$1.getAudioContext();this._gainNode=t.createGain(),this._gainNode.gain.value=1e-5,this._gainNode.connect(t.destination),this._analyser=t.createAnalyser(),this._analyser.fftSize=1024,this._analyser.smoothingTimeConstant=0,this._analyser.connect(this._gainNode),this._fftBins=new Uint8Array(this._analyser.frequencyBinCount),this._mediaStreamSource=t.createMediaStreamSource(e),this._mediaStreamSource.connect(this._analyser);}catch(t){}}get stream(){return this._stream}get trackId(){return this._trackId}_getBins(){if(!this._fftBins||!this._analyser)return new Uint8Array;this._analyser.getByteFrequencyData(this._fftBins);let r=zn/this._fftBins.length,e=Math.ceil(l$1.voiceParams.minFreq/r),t=Math.floor(l$1.voiceParams.maxFreq/r);return this._fftBins.subarray(e,t)}getLevel(){let r=this._getBins(),t=r.reduce((a,o)=>a+o,0)/r.length/255,i=this._lastSmoothedLevel*l$1.voiceParams.smoothing+t*(1-l$1.voiceParams.smoothing);return this._lastSmoothedLevel=i,{real:t,smoothed:i}}destroy(){this._mediaStreamSource&&(this._mediaStreamSource.disconnect(),this._mediaStreamSource=null),this._gainNode&&(this._gainNode.disconnect(),this._gainNode=null),this._analyser&&(this._analyser.disconnect(),this._analyser=null,this._fftBins=null,this._lastSmoothedLevel=0);}};var ai=class extends te{constructor(e){super();this._detector=null;this._track=null;this._interval=null;let t=()=>{this._detector&&g$1.onLocalVolume(this._detector.getLevel().real,e.getMediaSettings().isAudioEnabled),this._interval=window.setTimeout(t,l$1.voiceParams.interval);};this._interval=window.setTimeout(t,l$1.voiceParams.interval);let i=()=>{let a=e.getSendAudioTrack();a&&this.init(a);};this.subscribe(e,"SOURCE_CHANGED",a=>{a.kind==="audio"&&a.mediaSettings.isAudioEnabled&&i();}),i();}init(e){this._stopDetector(),this._track=e.clone(),this._detector=new Bt("local",new MediaStream([this._track]));}_stopDetector(){this._detector&&(this._detector.destroy(),this._detector=null),this._track&&(this._track.stop(),this._track=null);}destroy(){this.unsubscribe(),this._interval&&(window.clearTimeout(this._interval),this._interval=null),this._stopDetector();}};var Da=(o=>(o.producerNotification="producerNotification",o.producerCommand="producerCommand",o.consumerScreenShare="consumerScreenShare",o.producerScreenShare="producerScreenShare",o.asr="asr",o.animoji="animoji",o))(Da||{}),qe=Da;var at=class{constructor(){this._isAcceptedCallMarked=!1;}measureSignalingConnection(r){let e=S$1.FIRST_MEDIA_RECEIVED;if(!r){Ve(e);return}let t=it(e);t===null||r.conversation.topology!=="SERVER"||ge.logEventualStat({name:e,value:t});}markAcceptCall(){Ve(S$1.FIRST_MEDIA_RECEIVED);}markAcceptedCall(r){this._isAcceptedCallMarked||r==="SERVER"||(this._isAcceptedCallMarked=!0,Ve(S$1.FIRST_MEDIA_RECEIVED));}static measure(){ge.logEventualStat({name:S$1.FIRST_MEDIA_RECEIVED});}};var ka="videochat-epi",Jn=5e3,ot=class extends te{constructor(e,t,i=!1){super();this._previousTimestamp=0;this._previousCallStatReportTimestamp=0;this._previousCallStatReport=null;this._screenShareStats=[];this._handleScreenSharingStat=e=>{this._screenShareStats.push(e);};this._signaling=t,this._directTopology=i,this.subscribe(e,"REMOTE_DATA_STATS",this._handleStats.bind(this)),this.subscribe(e,"SCREEN_SHARING_STAT",this._handleScreenSharingStat.bind(this));}destroy(){this.unsubscribe();}static getEstimatedPerformanceIndex(){try{let e=parseInt(localStorage.getItem(ka)||"",10);return isNaN(e)?0:e}catch(e){return 0}}_handleStats(e){return c(this,null,function*(){if(!e.inbound||!e.inbound.rtps)return;let t=Date.now();!this._directTopology&&l$1.perfStatReportEnabled&&this._previousTimestamp+Jn<=t&&(yield this.reportPerfStats(e),this._previousTimestamp=t),l$1.callStatReportEnabled&&this._previousCallStatReportTimestamp+l$1.statisticsInterval<=t&&(this._reportCallStats(e),this._previousCallStatReportTimestamp=t);})}reportPerfStats(e){return c(this,null,function*(){let t=e.inbound.rtps.reduce((i,a)=>(a.kind==="video"&&(i.framesDecoded+=a.framesDecoded||0,i.framesReceived+=a.framesReceived||0),i),{framesDecoded:0,framesReceived:0});if(t.framesDecoded)try{let i=yield this._signaling.reportPerfStat(t);localStorage.setItem(ka,i.estimatedPerformanceIndex);}catch(i){}})}_reportCallStats(e){var a,o,s,p;let t={call_topology:this._directTopology?"D":"S",nack_received:0,pli_received:0,fir_received:0,frames_dropped:0,jitter_video:0,jitter_audio:0,interframe_delay_variance:0,nack_sent:0,pli_sent:0,fir_sent:0,total_audio_samples_received:0,concealed_audio_samples:0,silent_concealed_audio_samples:0,inserted_audio_samples_for_deceleration:0,removed_audio_samples_for_acceleration:0,audio_concealment_events:0,total_audio_energy:0,inbound_video_count:0,inbound_audio_count:0,freeze_count:0,total_freezes_duration:0,rtt:Math.round(e.inbound.transport.currentRoundTripTime*1e3),ss_freeze_count:0,ss_total_freezes_duration:0,local_address:wa(e.inbound.transport.local),local_connection_type:(a=e.inbound.transport.local)==null?void 0:a.type,network_type:(o=e.inbound.transport.local)==null?void 0:o.networkType,transport:(s=e.inbound.transport.local)==null?void 0:s.protocol,remote_address:wa(e.inbound.transport.remote),remote_connection_type:(p=e.inbound.transport.remote)==null?void 0:p.type};for(this._previousCallStatReport||(this._previousCallStatReport=Object.assign({},t)),e.inbound.rtps.reduce((u,m)=>(m.kind==="video"?(m.framesReceived&&(u.jitter_video=u.jitter_video*u.inbound_video_count/(u.inbound_video_count+1)+m.jitter*1e3/(u.inbound_video_count+1),u.interframe_delay_variance=u.interframe_delay_variance*u.inbound_video_count/(u.inbound_video_count+1)+m.interframeDelayVariance*1e6/(u.inbound_video_count+1),u.inbound_video_count++),u.frames_dropped+=m.framesDropped,u.nack_sent+=m.nackCount,u.pli_sent+=m.pliCount,u.fir_sent+=m.firCount,u.freeze_count+=m.freezeCountDelta,u.total_freezes_duration+=m.totalFreezesDurationDelta):(m.totalSamplesReceived&&(u.jitter_audio=u.jitter_audio*u.inbound_audio_count/(u.inbound_audio_count+1)+m.jitter*1e3/(u.inbound_audio_count+1),u.total_audio_energy=u.total_audio_energy*u.inbound_audio_count/(u.inbound_audio_count+1)+m.totalAudioEnergy/(u.inbound_audio_count+1),u.inbound_audio_count++),u.total_audio_samples_received+=m.totalSamplesReceived,u.inserted_audio_samples_for_deceleration+=m.insertedSamplesForDeceleration,u.removed_audio_samples_for_acceleration+=m.removedSamplesForAcceleration,u.concealed_audio_samples+=m.concealedSamples,u.silent_concealed_audio_samples+=m.silentConcealedSamples,u.audio_concealment_events+=m.concealmentEvents),u),t),e.outbound.rtps.reduce((u,m)=>(m.kind==="video"&&(u.nack_received+=m.nackCount,u.pli_received+=m.pliCount,u.fir_received+=m.firCount),u),t);this._screenShareStats.length;){let u=this._screenShareStats.pop();u.freeze_duration&&(t.ss_freeze_count+=1,t.ss_total_freezes_duration+=u.freeze_duration);}let i={call_topology:t.call_topology,nack_sent:t.nack_sent-this._previousCallStatReport.nack_sent,nack_received:t.nack_received-this._previousCallStatReport.nack_received,pli_sent:t.pli_sent-this._previousCallStatReport.pli_sent,pli_received:t.pli_received-this._previousCallStatReport.pli_received,fir_sent:t.fir_sent-this._previousCallStatReport.fir_sent,fir_received:t.fir_received-this._previousCallStatReport.fir_received,frames_dropped:t.frames_dropped-this._previousCallStatReport.frames_dropped};if(t.rtt&&(i.rtt=t.rtt),t.jitter_video&&(i.jitter_video=t.jitter_video),t.jitter_audio&&(i.jitter_audio=t.jitter_audio),t.interframe_delay_variance&&(i.interframe_delay_variance=t.interframe_delay_variance),t.freeze_count&&t.total_freezes_duration&&(i.freeze_count=t.freeze_count,i.total_freezes_duration=t.total_freezes_duration*1e3),t.ss_freeze_count&&t.ss_total_freezes_duration&&(i.ss_freeze_count=t.ss_freeze_count,i.ss_total_freezes_duration=t.ss_total_freezes_duration),t.total_audio_samples_received){let u=t.total_audio_samples_received-this._previousCallStatReport.total_audio_samples_received,m=t.inserted_audio_samples_for_deceleration-this._previousCallStatReport.inserted_audio_samples_for_deceleration,E=t.removed_audio_samples_for_acceleration-this._previousCallStatReport.removed_audio_samples_for_acceleration,P=t.concealed_audio_samples-this._previousCallStatReport.concealed_audio_samples,k=t.silent_concealed_audio_samples-this._previousCallStatReport.silent_concealed_audio_samples,D=t.audio_concealment_events-this._previousCallStatReport.audio_concealment_events;i.inserted_audio_samples_for_deceleration=m/u*1e3,i.removed_audio_samples_for_acceleration=E/u*1e3,i.concealed_audio_samples=P/u*1e3,i.concealed_silent_audio_samples=k/u*1e3,i.concealment_audio_avg_size=P/D,i.total_audio_energy=t.total_audio_energy;}Oa(t,"local_address","local_connection_type","network_type","transport")&&(i.local_address=t.local_address,i.local_connection_type=t.local_connection_type,i.network_type=t.network_type,i.transport=t.transport),Oa(t,"remote_address","remote_connection_type")&&(i.remote_address=t.remote_address,i.remote_connection_type=t.remote_connection_type),ge.logCallStat(i),d.log("Sent call stats",i),this._previousCallStatReport=t;}};function Oa(n,...r){for(let e of r)if(!n.hasOwnProperty(e)||n[e]===void 0)return !1;return !0}function wa(n){if(n)return `${n.address}:${n.port}`}var Oi=.8,st=class extends te{constructor(e,t,i,a,o,s={}){super();this._remoteSDP={};this._remoteCandidates={};this._state="IDLE";this._animojiDataChannel=null;this._animojiReceiver=null;this._animojiSender=null;this._animojiSvgDataByParticipantId={};this._isOpen=!1;this._remotePeerId=null;this._statInterval=null;this._settingsInterval=null;this._failedOnCreate=null;this._remoteStream=null;this._iceRestartTimeout=null;this._reconnectionTimeout=null;this._reconnectionPrevented=!1;this._fingerprint=null;this._neverConnected=!0;this._prevConsumerSettings={};this._lastNetworkStat={rtt:0,loss:0,date:0};this._remoteNetworkStat={rtt:0,loss:0};this._networkLimits={badNet:{loss:3,rtt:1e3},goodNet:{loss:.5,rtt:600}};if(this._signaling=i,this._mediaSource=a,this._participantId=e,this._isMaster=t,this._serverSettings=o,this._animojiSvgDataByParticipantId=s,this._perfStatReporter=new ot(this,i,!0),this.subscribe(this._signaling,ve.NOTIFICATION,this._onSignalingNotification.bind(this)),this.subscribe(this._mediaSource,"TRACK_REPLACED",this._onReplacedTrack.bind(this)),this.subscribe(this._mediaSource,"SOURCE_CHANGED",this._applySettings.bind(this)),this.subscribe(this._mediaSource,"ANIMOJI_STATUS",this._onAnimojiStatus.bind(this)),this._pc=new RTCPeerConnection({iceServers:l$1.iceServers,iceTransportPolicy:l$1.forceRelayPolicy?"relay":"all"},{optional:[{googSuspendBelowMinBitrate:!1}]}),this._pc.onicecandidate=this._handleIceCandidate.bind(this),this._pc.ontrack=this._onAddTrack.bind(this),this._pc.oniceconnectionstatechange=this._onIceConnectionStateChange.bind(this),this._pc.onconnectionstatechange=this._onConnectionStateChange.bind(this),this._pc.onsignalingstatechange=this._onSignalingStateChange.bind(this),this._prevConsumerSettings={},l$1.useVmoji&&this._createDataChannel(this._pc,qe.animoji,p=>{this._animojiDataChannel=p,this._animojiDataChannel.binaryType="arraybuffer",this._createAnimojiReceiver(),this._mediaSource.isAnimojiRequested&&this._createAnimojiSender();}),this._isMaster){try{this._mediaSource.addTrackToPeerConnection(this._pc,!1,!0,l$1.p2pAudioRed),this._applySettings();}catch(p){v$1.log(S$1.ERROR,"addTrack-direct"),d.error("Unable to add media source tracks",p,{participantId:this._participantId}),this._failedOnCreate=p;return}this._createOffer(!1).catch(p=>{this._state==="IDLE"?this._failedOnCreate=p:this.close(p);});}this._startSettingsInterval();}getState(){return this._state}updateStatisticsInterval(){this._stopStatInterval(),this._isDeadConnection()||this._startStatInterval();}_isDeadConnection(){return ["IDLE","CLOSED","FAILED"].includes(this.getState())}open(e=null){return c(this,null,function*(){if(this._isOpen){d.warn("DirectTransport: Already opened",{participantId:this._participantId});return}if(this._failedOnCreate){this.close(this._failedOnCreate);return}if(d.debug("DirectTransport: Open transport",{participantId:this._participantId}),this._isOpen=!0,this._remotePeerId=e,!this._isMaster)try{this._mediaSource.addTrackToPeerConnection(this._pc,!1,!0,l$1.p2pAudioRed),this._applySettings();}catch(i){v$1.log(S$1.ERROR,"addTrack-direct"),d.error("DirectTransport: Unable to add media source tracks",i,{participantId:this._participantId}),this.close(i);return}this._setState("OPENED");let t=e;if(!e){let i=Object.keys(this._remoteSDP);t=i[i.length-1];}if(t&&this._remoteSDP[t])try{yield this._setRemoteDescription(t,this._remoteSDP[t]);}catch(i){this.close();return}this._remoteSDP={},this._remoteCandidates={};})}updateSettings(e){Di(e,this._serverSettings)||(this._serverSettings=e,this._applySettings());}preventRestart(){this._reconnectionPrevented=!0;}allowRestart(){this._reconnectionPrevented=!1;}close(e){this._isOpen=!1,this._stopReconnection(),this._removeAnimojiReceiver(),this._removeAnimojiSender(),this._remoteStream&&(this._remoteStream.getTracks().forEach(t=>{t.stop(),this._triggerEvent("REMOTE_TRACK_REMOVED",this._remoteStream,t);}),this._remoteStream=null),this._stopStatInterval(),this._stopSettingsInterval(),this._pc&&(this._pc.onicecandidate=null,this._pc.ontrack=null,this._pc.oniceconnectionstatechange=null,this._pc.onconnectionstatechange=null,this._pc.onsignalingstatechange=null,this._pc.close()),this.unsubscribe(),e?(d.error("DirectTransport: Closed",e,{participantId:this._participantId}),this._setState("FAILED")):(d.debug("DirectTransport: Closed",{participantId:this._participantId}),this._setState("CLOSED")),this._triggerEvent("PEER_CONNECTION_CLOSED");}setAnimojiSvg(e,t){var i;(i=this._animojiReceiver)==null||i.setParticipantSvg(e,t);}_setState(e){this._state!==e&&(d.debug(`DirectTransport: State changed to ${e}`,{participantId:this._participantId}),this._state=e,this._triggerEvent("STATE_CHANGED",e));}_onSignalingNotification(e){var t,i,a,o;switch(e.notification){case w$1.TRANSMITTED_DATA:this._handleTransmittedData(e);break;case w$1.SETTINGS_UPDATE:Object.assign(this._networkLimits.badNet,((t=e.settings)==null?void 0:t.badNet)||{}),Object.assign(this._networkLimits.goodNet,((i=e.settings)==null?void 0:i.goodNet)||{});break;case w$1.CUSTOM_DATA:e.data.hasOwnProperty("sdk")&&(this._remoteNetworkStat.rtt=((a=e.data.sdk)==null?void 0:a.rtt)||0,this._remoteNetworkStat.loss=((o=e.data.sdk)==null?void 0:o.loss)||0);break}}_handleTransmittedData(e){let t=e.data,i=R$1.getPeerIdString(e.peerId);R$1.composeMessageId(e)===this._participantId&&(t.candidate&&t.candidate.candidate?this._addIceCandidate(i,t.candidate).catch(this.close.bind(this)):t.sdp&&this._setRemoteDescription(i,t.sdp).catch(this.close.bind(this)));}_addIceCandidate(e,t){return c(this,null,function*(){if(this._isOpen&&(!this._remotePeerId||this._remotePeerId===e)&&this._pc&&this._pc.remoteDescription){d.debug("Add remote ice candidate",{participantId:this._participantId,candidate:t});try{yield this._pc.addIceCandidate(new RTCIceCandidate(t));}catch(i){throw v$1.log(S$1.ERROR,"addIceCandidate-direct"),d.error("Unable to add remote ice candidate",i,{participantId:this._participantId,candidate:t}),i}}else d.debug("Cache remote ice candidate",{participantId:this._participantId,candidate:t}),this._remoteCandidates[e]=this._remoteCandidates[e]||[],this._remoteCandidates[e].push(t);})}_setRemoteCandidates(e){return c(this,null,function*(){if(!this._remoteCandidates[e]){d.log(`No cached candidates found for peer ${e}`);return}let t=this._remoteCandidates[e];this._remoteCandidates[e]=[];for(let i of t)try{yield this._addIceCandidate(e,i);}catch(a){}})}_setRemoteDescription(e,t){return c(this,null,function*(){if(this._isOpen&&(!this._remotePeerId||this._remotePeerId===e)&&this._pc){d.debug("Add remote description",{participantId:this._participantId,sdp:t}),this._calcFingerprint(t.sdp);try{yield this._pc.setRemoteDescription(new RTCSessionDescription(t)),yield this._setRemoteCandidates(e);}catch(i){throw v$1.log(S$1.ERROR,"setRemoteDescription-direct"),d.error("Unable to set remote description",i,{participantId:this._participantId,sdp:t}),i}}else this._remoteSDP[e]=t;})}_onAddTrack(e){d.debug("Added remote track",{participantId:this._participantId,kind:e.track.kind}),at.measure(),this._remoteStream?this._remoteStream.addTrack(e.track):(this._remoteStream=new MediaStream([e.track]),this._remoteStream.onremovetrack=t=>{this._triggerEvent("REMOTE_TRACK_REMOVED",this._remoteStream,t.track);}),this._triggerEvent("REMOTE_TRACK_ADDED",this._remoteStream,e.track);}_handleIceCandidate(e){return c(this,null,function*(){e.candidate&&this._signaling.ready&&(d.debug("Local ice candidate",{participantId:this._participantId,candidate:e.candidate}),yield this._signaling.sendCandidate(this._participantId,e.candidate));})}_onSignalingStateChange(){switch(d.debug(`DirectTransport: Signaling state changed to ${this._pc.signalingState}`,{participantId:this._participantId}),this._pc.signalingState){case"have-local-offer":let e=this._pc.localDescription;e?this._signaling.sendSdp(this._participantId,e).catch(this.close.bind(this)):this.close(new Error);break;case"have-remote-offer":this._createAnswer().catch(this.close.bind(this)).then(t=>c(this,null,function*(){return this._signaling.sendSdp(this._participantId,t)})).catch(this.close.bind(this));break}}_onIceConnectionStateChange(){switch(d.debug(`DirectTransport: Ice Connection state changed to ${this._pc.iceConnectionState}`,{participantId:this._participantId}),this._pc.iceConnectionState){case"checking":let e=this.getState();e==="IDLE"||e==="OPENED"?this._setState("CONNECTING"):this._setState("RECONNECTING");break}}_onConnectionStateChange(){switch(d.debug(`DirectTransport: Connection state changed to ${this._pc.connectionState}`,{participantId:this._participantId}),v$1.log(S$1.ICE_CONNECTION_STATE,this._pc.connectionState),this._pc.connectionState){case"connected":this._neverConnected=!1,this._setState("CONNECTED"),this._stopReconnection(),R$1.getPeerConnectionHostInfo(this._pc).then(e=>{e&&v$1.log(S$1.ICE_CONNECTION_TYPE,e.type);}),this._startStatInterval();break;case"failed":case"disconnected":this._reconnectionPrevented?this.close(new Error(`Ice connection ${this._pc.connectionState}`)):(this._setState("RECONNECTING"),this._startReconnection());break;case"closed":this.close(new Error("Ice connection closed"));break}}_startReconnection(){this._reconnectionTimeout||this._iceRestartTimeout||(d.log("Waiting for reconnection...",{participantId:this._participantId}),this._reconnectionTimeout=window.setTimeout(()=>{this._reconnectionTimeout=null,this._neverConnected?this._requestTopologySwitch():this._startIceRestart();},l$1.transportConnectionWaitTime));}_requestTopologySwitch(){this._isMaster&&this._signaling.ready&&(d.log("Switch topology DIRECT to SERVER",{participantId:this._participantId}),this._signaling.switchTopology("SERVER"));}_stopReconnection(){this._reconnectionTimeout&&(clearTimeout(this._reconnectionTimeout),this._reconnectionTimeout=null),this._iceRestartTimeout&&(clearTimeout(this._iceRestartTimeout),this._iceRestartTimeout=null);}_startIceRestart(){this._isMaster?(v$1.log(S$1.ICE_RESTART),d.log("Ice restart",{participantId:this._participantId}),this._createOffer(!0).catch(this.close.bind(this))):d.debug("Waiting for ice restart...",{participantId:this._participantId}),this._iceRestartTimeout=window.setTimeout(()=>{this._iceRestartTimeout=null,d.error("Ice restart failed",{participantId:this._participantId}),v$1.log(S$1.ERROR,"iceRestart-direct"),this._requestTopologySwitch();},l$1.iceRestartWaitTime);}_createOffer(e){return c(this,null,function*(){let t={iceRestart:e,offerToReceiveAudio:!0,offerToReceiveVideo:!0};return d.debug("Create offer",{participantId:this._participantId,options:t}),this._pc.createOffer(t).catch(i=>{throw d.error("Unable to create offer",i,{participantId:this._participantId}),v$1.log(S$1.ERROR,"createOffer-direct"),i}).then(i=>c(this,null,function*(){return d.debug("Created offer",{participantId:this._participantId,offer:i}),i=st._patchDescription(i),d.debug("Set local description",{participantId:this._participantId,offer:i}),this._calcFingerprint(i.sdp),this._pc.setLocalDescription(i).then(()=>this._pc.localDescription)})).catch(i=>{throw d.error("Unable to set local description",i,{participantId:this._participantId}),v$1.log(S$1.ERROR,"setLocalDescription-direct"),i})})}_createAnswer(){return c(this,null,function*(){return d.debug("Create answer",{participantId:this._participantId}),this._pc.createAnswer().catch(e=>{throw d.error("Unable to create answer",e,{participantId:this._participantId}),v$1.log(S$1.ERROR,"createAnswer-direct"),e}).then(e=>c(this,null,function*(){return d.debug("Created answer",{participantId:this._participantId,answer:e}),e=st._patchDescription(e),d.debug("Set local description",{participantId:this._participantId,answer:e}),this._calcFingerprint(e.sdp),this._pc.setLocalDescription(e)})).then(()=>this._pc.localDescription).catch(e=>{throw d.error("Unable to set local description",e,{participantId:this._participantId}),v$1.log(S$1.ERROR,"setLocalDescription-direct"),e})})}static _patchDescription(e){let t=!!b$1.baseChromeVersion();return e.sdp=R$1.patchLocalSDP(e.sdp,l$1.preferH264&&b$1.canPreferH264(),b$1.isBrokenH264(),l$1.preferVP9,l$1.h264spsPpsIdrInKeyframe,t&&l$1.audioNack,l$1.p2pAudioRed),e}_onReplacedTrack(e){this._pc&&(this._pc.getSenders().forEach(t=>{t.track&&t.track.kind===e.kind&&t.track.contentHint===e.contentHint&&(t.track.enabled=e.enabled,t.replaceTrack(e).catch(i=>{d.error("DirectTransport: Unable to replace track",i,{participantId:this._participantId}),v$1.log(S$1.ERROR,"replaceTrack-direct");}));}),this._applySettings());}_onAnimojiStatus(e){e?this._createAnimojiSender():this._removeAnimojiSender(),this._mediaSource.onAnimojiSender(e);}_startStatInterval(){if(this._statInterval)return;let e=()=>{if(this._isDeadConnection()){this._stopStatInterval();return}Yt(this._pc,this._lastStat).then(t=>{this._lastStat=t;let i={inbound:{topology:"DIRECT",transport:t.transport,rtps:t.rtps.filter(a=>a.type==="inbound-rtp"?(a.userId=this._participantId,!0):!1)},outbound:{topology:"DIRECT",transport:t.transport,rtps:t.rtps.filter(a=>a.type==="outbound-rtp")}};this._checkBadNetwork(i),this._triggerEvent("REMOTE_DATA_STATS",i),this._statInterval=window.setTimeout(e,l$1.statisticsInterval);});};this._statInterval=window.setTimeout(e,l$1.statisticsInterval);}_stopStatInterval(){this._statInterval&&(window.clearTimeout(this._statInterval),this._statInterval=null);}_checkBadNetwork(e){if(!this._signaling.ready)return;let t=re=>re.rtt<=this._networkLimits.goodNet.rtt&&re.loss<=this._networkLimits.goodNet.loss,i=re=>re.rtt>=this._networkLimits.badNet.rtt||re.loss>=this._networkLimits.badNet.loss,a=Math.round(e.outbound.transport.currentRoundTripTime*1e3)||0,o=e.inbound.rtps.reduce((re,X)=>Math.max(re,X.packetLoss||0),0),s={rtt:this._lastNetworkStat.rtt*(1-Oi)+a*Oi,loss:this._lastNetworkStat.loss*(1-Oi)+o*Oi},p=i(s),u=t(s),m=i(this._remoteNetworkStat),E=t(this._remoteNetworkStat),P=i(this._lastNetworkStat),k=t(this._lastNetworkStat),j=p||m?.2:u&&E?1:0,Y=Date.now();if((P!==p||k!==u||Y-this._lastNetworkStat.date>l$1.networkStatisticsInterval)&&(this._lastNetworkStat.date=Date.now(),this._signaling.customData({sdk:Object.assign({type:"bad-net"},s)},null).catch(re=>{d.warn("Unable to send [bad-net]",re);})),j){let re={};re[this._participantId]=re[""]=j,this._triggerEvent("NETWORK_STATUS",re);}this._lastNetworkStat.rtt=s.rtt,this._lastNetworkStat.loss=s.loss;}_startSettingsInterval(){if(this._settingsInterval)return;let t=()=>{if(!this._pc){this._stopSettingsInterval();return}this._applySettings(),this._settingsInterval=window.setTimeout(t,2e3);};this._settingsInterval=window.setTimeout(t,2e3);}_stopSettingsInterval(){this._settingsInterval&&(window.clearTimeout(this._settingsInterval),this._settingsInterval=null);}_calcFingerprint(e){let t=R$1.sdpFingerprint(e);if(t===null){d.warn("Fingerprint calculation is unsupported");return}this._fingerprint===null?this._fingerprint=t:(g$1.onFingerprintChange((this._fingerprint^t).toString()),this._fingerprint=null);}_applySettings(){var t;let e=this._mediaSource.getMediaSettings().isScreenSharingEnabled?this._serverSettings.screenSharing:this._serverSettings.camera;if(e&&((t=this._pc)==null?void 0:t.connectionState)==="connected"&&(this._prevConsumerSettings=R$1.applySettings(this._pc,e,this._prevConsumerSettings)),this._animojiSender){let i=this._mediaSource.getStream();i&&this._animojiSender.setStream(i);}}_createDataChannel(e,t,i){d.debug(`[${t}] data channel opening`);let a=e.createDataChannel(t,{negotiated:!0,id:1});a.onopen=()=>{let o=a.readyState;o==="open"?(d.debug(`[${t}] data channel opened`),a.onerror=s=>{d.error(`[${t}] data channel error`,s);},i(a)):d.error(`[${t}] data channel open failed, state [${o}]`);};}_createAnimojiReceiver(){!l$1.useVmoji||!this._animojiDataChannel||!this._participantId||(this._animojiReceiver&&this._removeAnimojiReceiver(),this._animojiReceiver=new l$1.vmoji.AnimojiReceiver(this._animojiDataChannel,this._participantId,(e,t)=>{this._triggerEvent("ANIMOJI_STREAM",e,t);},e=>{this._triggerEvent("ANIMOJI_STREAM",e,null);},l$1.vmojiRenderingOptions),Object.entries(this._animojiSvgDataByParticipantId).forEach(([e,t])=>{this._animojiReceiver.setParticipantSvg(e,t);}));}_removeAnimojiReceiver(){var e;(e=this._animojiReceiver)==null||e.destroy(),this._animojiReceiver=null;}_createAnimojiSender(){if(!l$1.useVmoji||!this._animojiDataChannel)return;let e=this._mediaSource.getStream();e&&(this._animojiSender&&this._removeAnimojiSender(),this._animojiSender=new l$1.vmoji.AnimojiSender(this._animojiDataChannel,e));}_removeAnimojiSender(){var e;(e=this._animojiSender)==null||e.destroy(),this._animojiSender=null;}};var Yn=16,Vt=class{constructor(r,e,t){d.debug("AsrReceiver started"),this._datachannel=r,this._participantIdRegistry=e,this._asrCallback=t,this._textDecoder=new TextDecoder,this._datachannel.onmessage=i=>this._onDataChannelMessage(i.data);}static parse(r){let e=new DataView(r),t=e.getUint8(0),i=e.getUint8(1);if(i!==0)throw new Error(`Unsupported message type. Message type: ${i}`);let a=e.getUint16(2),o=e.getUint32(4),s=e.getUint32(8),p=e.getUint32(12);if(t!==1)throw new Error(`Unexpected protocol version. Got ${t}, expected 1`);return {sequence:a,ssrc:o,timestamp:s,duration:p,data:r.slice(Yn)}}_onDataChannelMessage(r){var a,o;let e=Vt.parse(r),t=(o=(a=this._participantIdRegistry)==null?void 0:a.getStreamDescription(e.ssrc))==null?void 0:o.participantId;if(!t){d.warn(`Participant id for ssrc ${e.ssrc} not found in registry`);return}let i={participantId:t,text:this._textDecoder.decode(e.data),timestamp:e.timestamp,duration:e.duration};this._asrCallback(i);}destroy(){this._datachannel.onmessage=null;}};var wi=class{constructor(){this.streamDescriptionByCompactId=new Map;this.compactIdByStreamDescription=new Map;}getStreamDescription(r){return this.streamDescriptionByCompactId.get(r)}getCompactId(r){return this.compactIdByStreamDescription.get(r)}handleMessage(r){var a,o;let e=new Uint8Array(r),t=e[0],i=e.subarray(1);switch(t){case 1:let s=decode(i);return Object.entries(s).forEach(([D,q])=>{let j=ti(D);this.streamDescriptionByCompactId.set(q,j),this.compactIdByStreamDescription.set(D,q);}),null;case 2:case 4:let p=decode(i),u=[];for(let D of p){let q=this.getStreamDescription(D);q&&u.push(q.participantId);}return t===2?{type:"notification",notification:w$1.AUDIO_ACTIVITY,activeParticipants:u}:{type:"notification",notification:w$1.STALLED_ACTIVITY,stalledParticipants:u};case 3:let m=decode(i);return {type:"notification",notification:w$1.SPEAKER_CHANGED,speaker:(a=this.getStreamDescription(m))==null?void 0:a.participantId};case 5:let E=decode(i);return {type:"notification",notification:w$1.VIDEO_QUALITY_UPDATE,quality:{maxBitrate:E[0],maxDimension:E[1]}};case 6:let P=decode(i),k={};for(let[D,q]of Object.entries(P)){let j=(o=this.getStreamDescription(Number(D)))==null?void 0:o.participantId;j&&(k[j]=q/100);}return {type:"notification",notification:w$1.NETWORK_STATUS,statuses:k};case 7:return this._createParticipantSourcesUpdateNotification(i);case 8:{let q=decode(i).map(j=>{var Gt;let[Y,re,X,_e,Te,ct,pi]=j;return {participantId:(Gt=this.getStreamDescription(Y))==null?void 0:Gt.participantId,gain:re,pause:X,offset:_e,mute:Te,liveStatus:ct,startTimeMs:pi}});return {type:"notification",notification:w$1.MOVIE_UPDATE_NOTIFICATION,data:q}}default:return d.debug("unsupported message type: "+t),null}}_createParticipantSourcesUpdateNotification(r){let e=decode(r),t=[];for(let[i,a]of Object.entries(e)){let o=a[0],s=a[1],p=a[2],u=!!a[3],m;if(o!==null){if(m=this.getStreamDescription(o),!m){d.error(`could not uncompress participant ID ${o}`);continue}}else m=null;if(p===null){d.error("unexpected null sequenceNumber",i,a);continue}let E=Le.PARTICIPANT_AGNOSTIC_TRACK_PREFIX+"-"+i,P=s?s>>>0:null;t.push({participantStreamDescription:m,streamId:E,rtpTimestamp:P,sequenceNumber:p,fastScreenShare:u});}return {type:"notification",notification:w$1.PARTICIPANT_SOURCES_UPDATE,participantUpdateInfos:t}}};var Qn=90,Xn=4294967295,ye=class extends te{constructor(e,t,i,a={}){super();this._pc=null;this._producerNotification=null;this._producerCommand=null;this._producerScreen=null;this._consumerScreen=null;this._asr=null;this._animojiDataChannel=null;this._animojiReceiver=null;this._animojiSender=null;this._animojiSvgDataByParticipantId={};this._isOpen=!1;this._observer=!1;this._reconnectionPrevented=!1;this._state="IDLE";this._statInterval=null;this._settingsInterval=null;this._statBytes={};this._ssrcMap={};this._producerOfferIsProcessing=!1;this._producerNextOffer=null;this._prevConsumerSettings={};this._asrTrack=null;this._captureSender=null;this._captureReceiver=null;this._participantIdRegistry=null;this._disabledSenders=new Set;this._rtpReceiversByStreamId={};this._producerSessionId="";this._newAudioShareTrack=null;this._signaling=e,this._mediaSource=t,this.subscribe(this._signaling,ve.NOTIFICATION,this._onSignalingNotification.bind(this)),this.subscribe(this._mediaSource,"TRACK_REPLACED",this._onReplacedTrack.bind(this)),this.subscribe(this._mediaSource,"SOURCE_CHANGED",this._applyConsumerSettings.bind(this)),this.subscribe(this._mediaSource,"SCREEN_STATUS",this._onScreenSharingStatus.bind(this)),this.subscribe(this._mediaSource,"ANIMOJI_STATUS",this._onAnimojiStatus.bind(this)),this._perfStatReporter=new ot(this,e),this._serverSettings=i,this._animojiSvgDataByParticipantId=a,d.debug("ServerTransport: Created");}getState(){return this._state||"IDLE"}updateStatisticsInterval(){this._stopStatInterval();let e=this.getState();e!=="IDLE"&&e!=="CLOSED"&&e!=="FAILED"&&this._startStatInterval();}open(e=!1){if(this._isOpen){d.log("ServerTransport: Already opened connections");return}this._isOpen=!0,this._observer=e,this._openConnection();}close(e){this._isOpen=!1,this._closeConnection(),this.unsubscribe(),e?(d.error("ServerTransport: Closed",e),this._setState("FAILED")):(d.debug("ServerTransport: Closed"),this._setState("CLOSED"));}removeParticipant(e){var t;(t=this._captureReceiver)==null||t.close(e);}preventRestart(){this._reconnectionPrevented=!0;}allowRestart(){this._reconnectionPrevented=!1;}updateSettings(e){Di(e,this._serverSettings)||(this._serverSettings=e,this._applyConsumerSettings());}setAnimojiSvg(e,t){var i;(i=this._animojiReceiver)==null||i.setParticipantSvg(e,t);}_closeConnection(){this._stopStatInterval(),this._stopSettingsInterval(),this._removeAsrTrack(),this._removeCaptureSender(),this._removeCaptureReceiver(),this._removeAnimojiReceiver(),this._removeAnimojiSender(),this._pc&&(this._rtpReceiversByStreamId={},this._disabledSenders.forEach(e=>{var t;return (t=e.track)==null?void 0:t.stop()}),this._disabledSenders.clear(),this._pc.ontrack=null,this._pc.onconnectionstatechange=null,this._pc.onsignalingstatechange=null,this._participantIdRegistry=null,ye._closeDataChannel(this._producerNotification),ye._closeDataChannel(this._producerCommand),ye._closeDataChannel(this._producerScreen),ye._closeDataChannel(this._consumerScreen),ye._closeDataChannel(this._asr),this._pc.close(),this._pc=null,this._producerOfferIsProcessing=!1,this._producerNextOffer=null),this._triggerEvent("PEER_CONNECTION_CLOSED");}static _closeDataChannel(e){e&&(e.onopen=null,e.onmessage=null,e.onerror=null,e.close());}_createDataChannel(e,t,i){d.debug(`[${t}] data channel opening`);let a=e.createDataChannel(t,{ordered:!0});a.onopen=()=>{let o=a.readyState;o==="open"?(d.debug(`[${t}] data channel opened`),i(a)):d.error(`[${t}] data channel open failed, state [${o}]`);},a.onerror=o=>{let s=o.error;d.error(`[${t}] data channel error`,s==null?void 0:s.errorDetail,s==null?void 0:s.message);};}_openConnection(e=!1){d.debug("ServerTransport: Open single connection"),this._pc=new RTCPeerConnection({},{optional:[{googSuspendBelowMinBitrate:!1}]}),this._pc.ontrack=this._onAddTrack.bind(this,this._pc),this._pc.onconnectionstatechange=R$1.throttle(t=>{this._pc&&this._onConnectionStateChange(this._pc,t);},500),this._pc.onsignalingstatechange=ye._onSignalingStateChange.bind(this,this._pc),this._participantIdRegistry=new wi,this._signaling.setParticipantIdRegistry(this._participantIdRegistry),l$1.producerNotificationDataChannel&&this._createDataChannel(this._pc,qe.producerNotification,t=>{this._producerNotification=t,this._producerNotification.binaryType="arraybuffer",this._signaling.setProducerNotificationDataChannel(t);}),l$1.producerCommandDataChannel&&(this._signaling.useCommandDataChannel(!0),this._createDataChannel(this._pc,qe.producerCommand,t=>{this._producerCommand=t,this._signaling.setProducerCommandDataChannel(t);})),l$1.producerScreenDataChannel&&this._createDataChannel(this._pc,qe.producerScreenShare,t=>{this._producerScreen=t,this._producerScreen.binaryType="arraybuffer",this._createCaptureReceiver();}),l$1.asrDataChannel&&this._createDataChannel(this._pc,qe.asr,t=>{this._asr=t,this._asr.binaryType="arraybuffer",this._removeAsrTrack(),this._asrTrack=new Vt(t,this._participantIdRegistry,i=>{this._onAsrTranscription(i);}),this._signaling.setAsrDataChannel(t);}),l$1.useVmoji&&this._createDataChannel(this._pc,qe.animoji,t=>{this._animojiDataChannel=t,this._animojiDataChannel.binaryType="arraybuffer",this._createAnimojiReceiver(),this._mediaSource.isAnimojiRequested&&this._createAnimojiSender();}),this._newAudioShareTrack=this._mediaSource.getAudioShareTrack();try{this._mediaSource.addTrackToPeerConnection(this._pc,this._observer,!1,l$1.serverAudioRed),this._prevConsumerSettings={},this._applyConsumerSettings();}catch(t){d.error("ServerTransport: Unable to add media source tracks",t),v$1.log(S$1.ERROR,"addTrack-single"),this.close(t);return}l$1.consumerScreenDataChannel&&this._createDataChannel(this._pc,qe.consumerScreenShare,t=>{this._consumerScreen=t,this._consumerScreen.binaryType="arraybuffer";let i=this._mediaSource.getScreenTrack();i&&this._createCaptureSender(i);}),e||this._allocateConsumer(),this._setState("OPENED"),this._startStatInterval(),this._startSettingsInterval();}_removeAsrTrack(){var e;(e=this._asrTrack)==null||e.destroy(),this._asrTrack=null;}_reconnect(){this.getState()!=="OPENED"&&(this._setState("RECONNECTING"),this._closeConnection(),this._openConnection(!0));}_signalActiveParticipants(e){this._triggerEvent("SIGNALLED_ACTIVE_PARTICIPANTS",e);}_signalStalledParticipants(e){this._triggerEvent("SIGNALLED_STALLED_PARTICIPANTS",e);}_signalSpeakerChanged(e){this._triggerEvent("SIGNALLED_SPEAKER_CHANGED",e);}_signalNetworkStatus(e){this._triggerEvent("NETWORK_STATUS",e);}_updateSSRCMap(e){e&&e.sdp.split(`
`).forEach(t=>{let i=`a=ssrc:([0-9]+) label:(audio|video)-((?:[ug]?[\\d]+)|(?:mix)|(?:${Le.PARTICIPANT_AGNOSTIC_TRACK_PREFIX}-[0-9]+))`,a=new RegExp(i).exec(t);a&&(this._ssrcMap[a[1]]=a[3]);});}_createCaptureSender(e){let t=this._mediaSource.getMediaSettings();!e||!l$1.consumerScreenDataChannel||!this._consumerScreen||!t.isScreenSharingEnabled||(this._captureSender&&this._removeCaptureSender(),this._captureSender=new ft(e,this._consumerScreen,this._signaling,t.isFastScreenSharingEnabled));}_removeCaptureSender(){var e;(e=this._captureSender)==null||e.destroy(),this._captureSender=null;}_createCaptureReceiver(){!l$1.producerScreenDataChannel||!this._producerScreen||(this._captureReceiver&&this._removeCaptureReceiver(),this._captureReceiver=new _t(this._producerScreen,this._participantIdRegistry,(e,t)=>{this._triggerEvent("REMOTE_STREAM_SECOND",e,t);},e=>{this._triggerEvent("REMOTE_STREAM_SECOND",e,null);},e=>{this._triggerEvent("SCREEN_SHARING_STAT",e);}));}_removeCaptureReceiver(){var e;(e=this._captureReceiver)==null||e.destroy(),this._captureReceiver=null;}_createAnimojiSender(){if(!l$1.useVmoji||!this._animojiDataChannel)return;let e=this._mediaSource.getStream();e&&(this._animojiSender&&this._removeAnimojiSender(),this._animojiSender=new l$1.vmoji.AnimojiSender(this._animojiDataChannel,e));}_removeAnimojiSender(){var e;(e=this._animojiSender)==null||e.destroy(),this._animojiSender=null;}_createAnimojiReceiver(){!l$1.useVmoji||!this._animojiDataChannel||!this._participantIdRegistry||(this._animojiReceiver&&this._removeAnimojiReceiver(),this._animojiReceiver=new l$1.vmoji.AnimojiReceiver(this._animojiDataChannel,this._participantIdRegistry,(e,t)=>{this._triggerEvent("ANIMOJI_STREAM",e,t);},e=>{this._triggerEvent("ANIMOJI_STREAM",e,null);},l$1.vmojiRenderingOptions),Object.entries(this._animojiSvgDataByParticipantId).forEach(([e,t])=>{this._animojiReceiver.setParticipantSvg(e,t);}));}_removeAnimojiReceiver(){var e;(e=this._animojiReceiver)==null||e.destroy(),this._animojiReceiver=null;}_applyConsumerSettings(){let e=this._mediaSource.getMediaSettings().isScreenSharingEnabled&&!l$1.consumerScreenDataChannel?this._serverSettings.screenSharing:this._serverSettings.camera;if(e&&this._pc){let t=[];this._pc.getSenders().forEach(i=>{if(!i.track||i.track.kind!=="video")return;let a=!this._disabledSenders.has(i),o=e.maxDimension!==0;if(a&&!o){d.log("Disabling video upload"),this._disabledSenders.add(i),i.replaceTrack(b$1.getBlackMediaTrack()).catch(p=>{d.error("Could not disable video upload",p);});return}let s=this._mediaSource.getSendVideoTrack();if(!a&&o&&s){d.log("Enabling video upload"),this._disabledSenders.delete(i);let p=i.track;p.enabled=s.enabled,i.replaceTrack(s).then(()=>p.stop()).catch(u=>{d.error("Could not enable video upload",u);});}R$1.applyVideoTrackSettings(e,i,s!=null?s:i.track,this._prevConsumerSettings,t);}),this._prevConsumerSettings=t;}if(this._animojiSender){let t=this._mediaSource.getStream();t&&this._animojiSender.setStream(t);}}_onScreenSharingStatus(e){e.track?this._createCaptureSender(e.track):this._removeCaptureSender();}_onAnimojiStatus(e){e?this._createAnimojiSender():this._removeAnimojiSender(),this._mediaSource.onAnimojiSender(e);}_setState(e){this._state!==e&&(this._state=e,this._triggerEvent("STATE_CHANGED",e));}_startStatInterval(){if(this._statInterval)return;let e=()=>{if(!this._pc){this._stopStatInterval();return}this._collectStat().then(t=>{this._reportStats(t),this._detectStaleTracks(t);}).catch(()=>{}),this._statInterval=window.setTimeout(e,l$1.statisticsInterval);};this._statInterval=window.setTimeout(e,l$1.statisticsInterval);}_stopStatInterval(){this._statInterval&&(window.clearTimeout(this._statInterval),this._statInterval=null),this._statBytes={};}_startSettingsInterval(){if(this._settingsInterval)return;let t=()=>{if(!this._pc){this._stopSettingsInterval();return}this._applyConsumerSettings(),this._settingsInterval=window.setTimeout(t,2e3);};this._settingsInterval=window.setTimeout(t,2e3);}_stopSettingsInterval(){this._settingsInterval&&(window.clearTimeout(this._settingsInterval),this._settingsInterval=null);}_collectStat(){return c(this,null,function*(){if(!this._pc)return Promise.reject();let e=yield Yt(this._pc,this._lastStat,this._ssrcMap);return this._lastStat=e,e})}_reportStats(e){this._triggerEvent("REMOTE_DATA_STATS",{inbound:{topology:"SERVER",transport:e.transport,rtps:e.rtps.filter(t=>t.type==="inbound-rtp")},outbound:{topology:"SERVER",transport:e.transport,rtps:e.rtps.filter(t=>t.type==="outbound-rtp")}});}_detectStaleTracks(e){let t=e.rtps.find(s=>s.type==="inbound-rtp"&&s.kind==="audio"&&this._ssrcMap[s.ssrc]==="mix");if(!t)return;let i=Le.AUDIO_MIX,a=this._statBytes[i],o=!1;if(a){let s=t.bytesReceived-a.bytesReceived;s>=0&&s<=5&&(o=!0),a.stalled!==o&&this._triggerEvent("REMOTE_ALL_STALL",o);}this._statBytes[i]={bytesReceived:t.bytesReceived,stalled:o};}_allocateConsumer(){if(!this._signaling.ready)return;let e={estimatedPerformanceIndex:ot.getEstimatedPerformanceIndex(),audioMix:!0,consumerUpdate:!0,producerNotificationDataChannelVersion:l$1.producerNotificationDataChannel?7:0,producerCommandDataChannelVersion:l$1.producerCommandDataChannel?3:0,consumerScreenDataChannelVersion:l$1.consumerScreenDataChannel?1:0,producerScreenDataChannelVersion:l$1.producerScreenDataChannel?1:0,asrDataChannelVersion:l$1.asrDataChannel?1:0,animojiDataChannelVersion:l$1.useVmoji?1:0,onDemandTracks:!0,unifiedPlan:!0,singleSession:!0,videoTracksCount:l$1.videoTracksCount,red:l$1.serverAudioRed,audioShare:l$1.audioShare,fastScreenShare:l$1.fastScreenShare};!l$1.videoTracksCount&&!this._observer&&d.warn("Setting videoTracksCount to 0 is deprecated"),this._signaling.allocateConsumer(null,e);}_acceptProducer(e){return c(this,null,function*(){if(this._producerOfferIsProcessing){this._producerNextOffer=e,d.debug("[single] wait until other remote offer is processed");return}this._producerOfferIsProcessing=!0;let t=new RTCSessionDescription({type:"offer",sdp:R$1.patchRemoteSDP(e)});if(d.debug("[single] set remote offer",{offer:t}),!this._pc)throw new Error("Interrupt allocation");this._pc.setRemoteDescription(t).catch(i=>{throw d.error("[single] unable to set remote offer",i),v$1.log(S$1.ERROR,"setRemoteDescription-single"),i}).then(()=>this._handleTracks()).then(()=>{if(d.debug("[single] create local answer"),!this._pc)throw new Error("Interrupt allocation");return this._pc.createAnswer()}).catch(i=>{throw d.error("[single] unable to create answer",i),v$1.log(S$1.ERROR,"createAnswer-single"),i}).then(i=>(i.sdp=R$1.patchLocalSDP(i.sdp,!1,b$1.isBrokenH264(),!1,l$1.h264spsPpsIdrInKeyframe),i)).then(i=>c(this,null,function*(){if(d.debug("[single] set local answer",{answer:i}),!this._pc)throw new Error("Interrupt allocation");return yield this._pc.setLocalDescription(i),i})).catch(i=>{throw d.error("[single] unable to set local answer",i),v$1.log(S$1.ERROR,"setLocalDescription-single"),i}).then(i=>c(this,null,function*(){d.debug("[single] transmit local answer",{answer:i}),this._updateSSRCMap(t),yield this._signaling.acceptProducer(i,Object.keys(this._ssrcMap)),d.debug("[single] remote offer has been processed");})).catch(i=>{d.warn("[single] unable to send local answer",i),v$1.log(S$1.ERROR,"acceptProducer");}).then(()=>c(this,null,function*(){if(this._producerOfferIsProcessing=!1,this._producerNextOffer){d.debug("[single] there is other unprocessed remote offer, process it");let i=this._producerNextOffer;return this._producerNextOffer=null,this._acceptProducer(i)}})).catch(i=>this.close(i));})}_handleTracks(){return c(this,null,function*(){var t;if(!this._newAudioShareTrack||this._observer)return;let e=(t=this._pc)==null?void 0:t.getTransceivers().find(i=>i.mid.endsWith("s"));if(!e||!e.sender){d.warn("Cannot find audioshare transceiver");return}e.sender.track!==null&&d.warn("Unexpected track assigned to audioshare");try{e.direction="sendonly",yield e.sender.replaceTrack(this._newAudioShareTrack),this._newAudioShareTrack=null;}catch(i){d.error("ServerTransport: Unable to replace track",i),v$1.log(S$1.ERROR,"replaceTrack-single");}})}_onSignalingNotification(e){return c(this,null,function*(){if(this._isOpen)switch(e.notification){case w$1.PRODUCER_UPDATED:yield this._onProducerUpdated(e);break;case w$1.REALLOC_CON:this._reconnect();break;case w$1.AUDIO_ACTIVITY:this._signalActiveParticipants(e.activeParticipants);break;case w$1.SPEAKER_CHANGED:this._signalSpeakerChanged(e.speaker);break;case w$1.STALLED_ACTIVITY:this._signalStalledParticipants(e.stalledParticipants);break;case w$1.NETWORK_STATUS:this._signalNetworkStatus(e.statuses);break}})}_onAsrTranscription(e){this._triggerEvent("ASR_TRANSCRIPTION",e);}_onProducerUpdated(e){return c(this,null,function*(){this._producerSessionId&&this._producerSessionId!==e.sessionId&&this._reconnect(),l$1.breakVideoPayloadTypes&&(d.log("test mode enabled, video switched off"),this._signaling.requestTestMode("breakVideoPayloadTypes",null)),this._producerSessionId=e.sessionId,yield this._acceptProducer(e.description);})}_onAddTrack(e,t){var a;d.debug("[single] remote track (added)",{track:t.track}),((a=t.track)==null?void 0:a.kind)==="audio"&&at.measure();let i=t.streams[0];i?(i.onremovetrack||(i.onremovetrack=s=>{this._triggerEvent("REMOTE_TRACK_REMOVED",i.id,i,s.track);}),i.getTracks().find(s=>s.id===t.track.id)||i.addTrack(t.track),this._rtpReceiversByStreamId[i.id]=t.receiver,this._triggerEvent("REMOTE_TRACK_ADDED",i.id,i,t.track)):d.error("[single] unable to get media stream from track event");}static _onSignalingStateChange(e,t){d.debug("[single] signaling state changed",{state:e.signalingState},t);}_onConnectionStateChange(e,t){switch(d.debug("[single] connection state changed",{state:e.connectionState},t),v$1.log(S$1.ICE_CONNECTION_STATE,e.connectionState),e.connectionState){case"failed":this._reconnectionPrevented?this.close(new Error("Ice connection failed")):(v$1.logCustom(S$1.RECONNECT,{param:1}),this._reconnect());break;case"connecting":let i=this.getState();i==="IDLE"||i==="OPENED"?this._setState("CONNECTING"):e.iceConnectionState==="checking"&&this._setState("RECONNECTING");break;case"disconnected":this._reconnectionPrevented?this.close(new Error("Ice connection disconnected")):this._setState("RECONNECTING");break;case"connected":this._setState("CONNECTED"),R$1.getPeerConnectionHostInfo(e).then(a=>{a&&v$1.log(S$1.ICE_CONNECTION_TYPE,a.type);}),v$1.logCustom(S$1.RECONNECT,{param:0});break}}_onReplacedTrack(e,t){var i;if(this._pc){l$1.consumerScreenDataChannel&&t&&(e=t);let a=(i=this._pc)==null?void 0:i.getSenders().find(o=>o.track&&o.track.kind===e.kind&&!this._disabledSenders.has(o)&&o.track.contentHint===e.contentHint);a?(a.track.enabled=e.enabled,a.replaceTrack(e).catch(o=>{d.error("ServerTransport: Unable to replace track",o),v$1.log(S$1.ERROR,"replaceTrack-single");})):e.kind==="audio"&&e.contentHint==="music"&&(this._newAudioShareTrack=e);}this._applyConsumerSettings();}getStreamWaitingTimeMs(e,t){if(!this._pc)return v$1.log(S$1.PAT_WAITING_TIME_ERROR,"noConnection"),d.error("Cannot get stream waiting time, peer connection is not initialized"),0;if(!RTCRtpReceiver.prototype.getSynchronizationSources)return v$1.log(S$1.PAT_WAITING_TIME_ERROR,"oldBrowser"),d.error("Cannot get stream waiting time, RTCRtpReceiver.getSynchronizationSources is not supported"),0;let i=this._rtpReceiversByStreamId[e];if(!i)return v$1.log(S$1.PAT_WAITING_TIME_ERROR,"noReceiver"),d.error(`Cannot get stream waiting time, cannot find RTP receiver by stream ID: ${e}`),0;let a=i.getSynchronizationSources();if(!a||!a.length)return d.log(`Cannot get stream waiting time, ${e} receiver has no synchronization sources`),0;let s=a[0].rtpTimestamp;if(!Number.isInteger(s))return v$1.log(S$1.PAT_WAITING_TIME_ERROR,"timestampNotInteger"),d.error(`Cannot get stream waiting time, ${e} receiver's RTP timestamp is not an integer: ${s}`),0;let p=t-s&Xn,u=Math.ceil(p/Qn);return Math.min(100,Math.max(0,u))}};var nt=(e=>(e.DIRECT="DIRECT",e.SERVER="SERVER",e))(nt||{}),xi=class extends te{constructor(e,t,i,a){super();this._allocated=[];this._opened=[];this._directTransport=null;this._serverTransport=null;this._dtListeners=[];this._stListeners=[];this._states={};this._localState="IDLE";this._animojiSvgDataByParticipantId={};this._signaling=t,this._mediaSource=i,this._topology=e,this._serverSettings=a,this.subscribe(this._signaling,ve.NOTIFICATION,this._onSignalingNotification.bind(this)),this.subscribe(this._mediaSource,"ANIMOJI_STATUS",this._onAnimojiStatus.bind(this)),e==="SERVER"&&(this._serverTransport=this._createServerTransport());}updateSettings(e){d.log("Update transport settings",e),this._serverSettings=e,this._directTransport&&this._directTransport.updateSettings(e),this._serverTransport&&this._serverTransport.updateSettings(e);}updateStatisticsInterval(){this._directTransport&&this._directTransport.updateStatisticsInterval(),this._serverTransport&&this._serverTransport.updateStatisticsInterval();}allocate(e,t=!1){if(d.log(`Trying allocate participant [${e}]`),this._allocated.indexOf(e)!==-1){d.warn(`The participant [${e}] has already had allocated transport`);return}this._allocated.push(e),this._topology==="DIRECT"&&!this._directTransport&&(this._directTransport=this._createDirectTransport(e,t)),this._topology==="SERVER"&&!this._serverTransport&&(this._serverTransport=this._createServerTransport());}open(e,t=null,i=!1,a=!1){d.log("Trying open participant",{participantIds:e});let o=a;for(let s of e){if(this._opened.indexOf(s)!==-1){d.warn(`The participant [${s}] has already had opened transport`);continue}if(this._allocated.indexOf(s)===-1){d.warn(`The participant [${s}] has no allocated transport`);continue}this._opened.push(s),o=!0;}o&&(this._topology==="DIRECT"&&this._directTransport&&this._directTransport.open(t),this._topology==="SERVER"&&this._serverTransport&&(this._serverTransport.open(i),this._setStates(e,this._serverTransport.getState()),this._setLocalState(this._serverTransport.getState())),d.debug("The transport has been opened",e));}close(e){var a;let t=this._allocated.indexOf(e),i=this._opened.indexOf(e);t<0&&d.warn(`The participant [${e}] transport has already deallocated`),this._topology==="DIRECT"&&this._directTransport&&(this._directTransport.close(),this._directTransport=null),this._topology==="SERVER"&&((a=this._serverTransport)==null||a.removeParticipant(e),this._setState(e,"CLOSED")),i>=0&&this._opened.splice(i,1),t>=0&&this._allocated.splice(t,1);}destroy(){this.unsubscribe(),this._dtListeners&&this._dtListeners.forEach(e=>{e.dispose();}),this._stListeners&&this._stListeners.forEach(e=>{e.dispose();}),this._directTransport&&(this._directTransport.close(),this._directTransport=null),this._serverTransport&&(this._serverTransport.close(),this._serverTransport=null),this._allocated=[],this._opened=[];}getTopology(){return this._topology}isAllocated(e){return this._allocated.indexOf(e)>=0}allocated(){return this._allocated.slice()}opened(){return this._opened.slice()}getState(){var e,t;return this._topology==="SERVER"?(e=this._serverTransport)==null?void 0:e.getState():(t=this._directTransport)==null?void 0:t.getState()}setAnimojiSvg(e,t){var i;this._animojiSvgDataByParticipantId[e]=t,l$1.useVmoji&&t.isMe&&((i=l$1.vmoji.AnimojiPreviewGenerator)==null||i.setSvgData(t)),(!(t.svg instanceof ArrayBuffer)||t.svg.byteLength!==0)&&(this._topology==="DIRECT"&&this._directTransport?this._directTransport.setAnimojiSvg(e,t):this._topology==="SERVER"&&this._serverTransport&&this._serverTransport.setAnimojiSvg(e,t));}_setStates(e,t){let i=e.filter(a=>this._states[a]!==t?(this._states[a]=t,!0):!1);i.length&&this._triggerEvent("STATE_CHANGED",i,t);}_setState(e,t){this._states[e]!==t&&(this._states[e]=t,this._triggerEvent("STATE_CHANGED",[e],t));}_setLocalState(e){this._localState!==e&&(this._localState=e,this._triggerEvent("LOCAL_STATE_CHANGED",e));}_onSignalingNotification(e){if(e.notification===w$1.TOPOLOGY_CHANGED)return this._onTopologyChanged(e)}_onTopologyChanged(e){var t;if(e.topology!==this._topology){if(d.log(`Topology changed ${this._topology} -> ${e.topology}`),v$1.log(S$1.TOPOLOGY_CHANGE_REQUESTED,e.topology),this._topology=e.topology,this._topology==="SERVER"&&(this._serverTransport?this._serverTransport.allowRestart():(this._serverTransport=this._createServerTransport(),this._opened.length>0&&((t=this._directTransport)==null||t.preventRestart(),this._serverTransport.open()))),this._topology==="DIRECT"){let i=e.offerTo||[],a=e.offerToTypes||[],o=e.offerToDeviceIdxs||[],s=i.length&&a.length?R$1.composeParticipantId(i[0],a[0],o[0]):null;if(this._serverTransport&&this._serverTransport.preventRestart(),!this._allocated||this._allocated.length===0){d.error("Topology changed to DIRECT, but the list of allocated participants is empty");return}this._allocated.length>1&&d.warn("Topology changed to DIRECT, but the allocated participants count more then one");let p=this._allocated[0];if(this._directTransport)this._directTransport.allowRestart();else {let u=s===p;this._directTransport=this._createDirectTransport(p,u);}this._opened.indexOf(p)>=0&&this._directTransport.open();}this._triggerEvent("TOPOLOGY_CHANGED",this._topology);}}_createDirectTransport(e,t=!1){let i=new st(e,t,this._signaling,this._mediaSource,this._serverSettings,this._animojiSvgDataByParticipantId);return this._dtListeners&&this._dtListeners.length>0&&d.warn(`The list of direct listeners for the participant [${e}] is not empty`),this._dtListeners=[],this._dtListeners.push(i.addEventListener("REMOTE_TRACK_ADDED",this._onDirectRemoteTrackAdded.bind(this,e)),i.addEventListener("REMOTE_TRACK_REMOVED",this._onDirectRemoteTrackRemoved.bind(this,e)),i.addEventListener("REMOTE_DATA_STATS",this._onDirectRemoteDataStats.bind(this)),i.addEventListener("STATE_CHANGED",this._onDirectTransportChanged.bind(this,e)),i.addEventListener("NETWORK_STATUS",this._onTransportNetworkStatus.bind(this)),i.addEventListener("PEER_CONNECTION_CLOSED",this._onPeerConnectionClosed.bind(this,"DIRECT")),i.addEventListener("ANIMOJI_STREAM",this._onAnimojiStream.bind(this))),i}_createServerTransport(){let e=new ye(this._signaling,this._mediaSource,this._serverSettings,this._animojiSvgDataByParticipantId);return this._stListeners&&this._stListeners.length>0&&d.warn("The list of server transport listeners is not empty"),this._stListeners=[],this._stListeners.push(e.addEventListener("REMOTE_TRACK_ADDED",this._onServerRemoteTrackAdded.bind(this)),e.addEventListener("REMOTE_TRACK_REMOVED",this._onServerRemoteTrackRemoved.bind(this)),e.addEventListener("REMOTE_ALL_STALL",this._onServerRemoteAllStall.bind(this)),e.addEventListener("REMOTE_DATA_STATS",this._onServerRemoteDataStats.bind(this)),e.addEventListener("STATE_CHANGED",this._onServerTransportChanged.bind(this)),e.addEventListener("SIGNALLED_ACTIVE_PARTICIPANTS",this._onTransportActiveParticipants.bind(this)),e.addEventListener("SIGNALLED_SPEAKER_CHANGED",this._onTransportSpeakerChanged.bind(this)),e.addEventListener("SIGNALLED_STALLED_PARTICIPANTS",this._onTransportStalledParticipants.bind(this)),e.addEventListener("NETWORK_STATUS",this._onTransportNetworkStatus.bind(this)),e.addEventListener("REMOTE_STREAM_SECOND",this._onRemoteStreamSecond.bind(this)),e.addEventListener("PEER_CONNECTION_CLOSED",this._onPeerConnectionClosed.bind(this,"SERVER")),e.addEventListener("ASR_TRANSCRIPTION",this._onAsrTranscription.bind(this)),e.addEventListener("ANIMOJI_STREAM",this._onAnimojiStream.bind(this))),e}_releaseDirectTransport(e){this._directTransport&&(e&&this._directTransport.close(),this._directTransport=null),this._dtListeners&&(this._dtListeners.forEach(t=>{t.dispose();}),this._dtListeners=[]);}_releaseServerTransport(e){this._serverTransport&&(e&&this._serverTransport.close(),this._serverTransport=null),this._stListeners&&(this._stListeners.forEach(t=>{t.dispose();}),this._stListeners=[]);}_setLocalNoiseSuppression(e){var t;l$1.noiseSuppression!==e&&(l$1.noiseSuppression=e,(t=this._mediaSource)==null||t.updateNoiseSuppression());}_onDirectTransportChanged(e,t){if(t==="CONNECTED"&&this._topology==="DIRECT"&&this._releaseServerTransport(!0),(t==="CLOSED"||t==="FAILED")&&(this._releaseDirectTransport(!1),this._topology==="DIRECT")){let i=this._opened.indexOf(e);i>=0&&this._opened.splice(i,1);let a=this._allocated.indexOf(e);a>=0&&this._allocated.splice(a,1);}this._topology==="DIRECT"&&(this._setState(e,t),this._setLocalState(t));}_onServerTransportChanged(e){let t=this._opened.slice();e==="CONNECTED"&&this._topology==="SERVER"&&this._releaseDirectTransport(!0),(e==="CLOSED"||e==="FAILED")&&(this._releaseServerTransport(!1),this._topology==="SERVER"&&(this._allocated=[],this._opened=[])),this._topology==="SERVER"&&(this._setStates(t,e),this._setLocalState(e));}_onTransportActiveParticipants(e){this._topology==="SERVER"&&this._triggerEvent("SIGNALLED_ACTIVE_PARTICIPANTS",e);}_onTransportStalledParticipants(e){this._topology==="SERVER"&&this._triggerEvent("SIGNALLED_STALLED_PARTICIPANTS",e);}_onTransportSpeakerChanged(e){this._topology==="SERVER"&&this._triggerEvent("SIGNALLED_SPEAKER_CHANGED",e);}_onTransportNetworkStatus(e){this._triggerEvent("NETWORK_STATUS",e);}_onRemoteStreamSecond(e,t){this._triggerEvent("REMOTE_STREAM_SECOND",e,t);}_onPeerConnectionClosed(e){this._triggerEvent("PEER_CONNECTION_CLOSED",e);}_onServerRemoteAllStall(e){this._topology==="SERVER"&&this._triggerEvent("REMOTE_ALL_STALL",e);}_onServerRemoteDataStats(e){this._triggerEvent("REMOTE_DATA_STATS",e);}_onDirectRemoteTrackAdded(e,t,i){this._triggerEvent("REMOTE_TRACK_ADDED",e,t,i);}_onDirectRemoteTrackRemoved(e,t,i){this._triggerEvent("REMOTE_TRACK_REMOVED",e,t,i);}_onDirectRemoteDataStats(e){this._triggerEvent("REMOTE_DATA_STATS",e);}_onServerRemoteTrackAdded(e,t,i){this._triggerEvent("REMOTE_TRACK_ADDED",e,t,i);}_onServerRemoteTrackRemoved(e,t,i){this._triggerEvent("REMOTE_TRACK_REMOVED",e,t,i);}_onAsrTranscription(e){this._triggerEvent("ASR_TRANSCRIPTION",e);}_onAnimojiStream(e,t){this._triggerEvent("ANIMOJI_STREAM",e,t);}_onAnimojiStatus(e){!this._directTransport&&!this._serverTransport&&this._mediaSource.onAnimojiSender(e);}getStreamWaitingTimeMs(e,t){return this._topology!=="SERVER"?(v$1.log(S$1.PAT_WAITING_TIME_ERROR,"wrongTopology"),d.error(`Cannot get stream waiting time, incorrect topology: ${this._topology}`),0):this._serverTransport?this._serverTransport.getStreamWaitingTimeMs(e,t):(v$1.log(S$1.PAT_WAITING_TIME_ERROR,"noTransport"),d.error("Cannot get stream waiting time, server transport is not initialized"),0)}};var Li=class extends te{constructor(e){super();this._detector=null;this._interval=null;this.subscribe(e,"REMOTE_TRACK_ADDED",this._onRemoteTrackAdded.bind(this)),this.subscribe(e,"REMOTE_TRACK_REMOVED",this._onRemoteTrackRemoved.bind(this)),this.subscribe(e,"SIGNALLED_ACTIVE_PARTICIPANTS",this._onSignalledActiveParticipants.bind(this)),this.subscribe(e,"TOPOLOGY_CHANGED",this._onTopologyChanged.bind(this));}destroy(){var e;this._interval&&(window.clearTimeout(this._interval),this._interval=null),this.unsubscribe(),(e=this._detector)==null||e.destroy(),this._detector=null;}_onRemoteTrackAdded(e,t,i){var a;if(i.kind==="audio"&&((a=this._detector)==null||a.destroy(),this._detector=new Bt(e,t),!this._interval)){let o=()=>{this._collectVolumes(),this._interval=window.setTimeout(o,l$1.voiceParams.interval);};this._interval=window.setTimeout(o,l$1.voiceParams.interval);}}_onRemoteTrackRemoved(e,t,i){i.kind==="audio"&&(!this._detector||this._detector.stream!==t||(this._detector.destroy(),this._detector=null));}_collectVolumes(){if(!this._detector)return;let e={},t=this._detector.trackId,i=this._detector.getLevel();if(t===Le.AUDIO_MIX){if(this._activeParticipants)for(let a of this._activeParticipants)e[a]=i;}else e[t]=i;this._triggerEvent("VOLUMES_DETECTED",e);}_onSignalledActiveParticipants(e){this._activeParticipants=e;}_onTopologyChanged(e){e==="DIRECT"&&(this._activeParticipants=null);}};var Ni=class extends te{constructor(e,t,i){super();this._speakerId=null;this._serverSideSpeakerDetection=!1;this._serverSideSpeakerDetection=i==="SERVER",this.subscribe(e,"VOLUMES_DETECTED",this._onVolumesDetected.bind(this)),this.subscribe(t,"SIGNALLED_SPEAKER_CHANGED",this._onServerSpeakerChanged.bind(this)),this.subscribe(t,"TOPOLOGY_CHANGED",this._onTopologyChanged.bind(this));}destroy(){this.unsubscribe();}_onVolumesDetected(e){if(this._serverSideSpeakerDetection)return;let t=0,i=null;if(Object.keys(e).forEach(a=>{let o=e[a].smoothed;o>t&&o>l$1.voiceParams.threshold&&(t=o,i=a);}),i&&i!==this._speakerId){let a=this._speakerId&&e.hasOwnProperty(this._speakerId)?e[this._speakerId].smoothed:0;t>a*l$1.voiceParams.speakerLevelMultiplier&&(this._speakerId=i,this._triggerEvent("SPEAKER_CHANGED",i));}}_onServerSpeakerChanged(e){this._serverSideSpeakerDetection&&this._triggerEvent("SPEAKER_CHANGED",e);}_onTopologyChanged(e){this._serverSideSpeakerDetection=e==="SERVER";}};var ni=class extends te{constructor(e,t,i){super();this._states={};this._volumes={};this._participants={};this._connectionTimeout=0;this._volumeTimeout=0;this._transport=e,this._participants=i,this.subscribe(e,"STATE_CHANGED",this._onTransportStateChanged.bind(this)),this.subscribe(t,"VOLUMES_DETECTED",this._onVolumesDetected.bind(this));}destroy(){this.unsubscribe(),this._connectionTimeout&&window.clearTimeout(this._connectionTimeout),this._volumeTimeout&&window.clearTimeout(this._volumeTimeout);}onChangeRemoteMediaSettings(e,t){t.isAudioEnabled||(this._volumes[e]=1),t.isAudioEnabled&&(this._volumes[e]=0);}_onTransportStateChanged(e,t){e.forEach(i=>this._states[i]=t),t==="OPENED"&&(this._connectionTimeout||(this._connectionTimeout=window.setTimeout(this._onConnectionTimeout.bind(this),l$1.specListenerParams.connectionTimeout)),this._volumeTimeout||(this._volumeTimeout=window.setTimeout(this._onVolumeTimeout.bind(this),l$1.specListenerParams.volumeTimeout))),t==="FAILED"&&this._connectionTimeout&&(d.warn("Transport failed, send callSpecError"),v$1.log(S$1.CALL_SPEC_ERROR,`${this._transport.getTopology()}_CONNECTION_TIMEOUT`));}_onVolumesDetected(e){Object.keys(e).forEach(t=>{this._volumes[t]=Math.max(e[t].real,this._volumes[t]||0);});}_onConnectionTimeout(){let e=i=>i!=="CONNECTED";(()=>Object.values(this._states).filter(e).length>0)()&&(d.warn("There is not connected transport, send callSpecError"),v$1.log(S$1.CALL_SPEC_ERROR,`${this._transport.getTopology()}_CONNECTION_TIMEOUT`)),this._connectionTimeout=0;}_onVolumeTimeout(){let e=[];Object.keys(this._volumes).forEach(t=>{if(this._volumes[t]>0)return;let i="UNKNOWN",a=this._participants[t];a&&a.platform&&(i=a.platform),e.indexOf(i)<0&&(e.push(i),v$1.log(S$1.CALL_SPEC_ERROR,`${this._transport.getTopology()}_VOLUME_TIMEOUT_${i}`));}),e.length&&d.warn("There is silent participant, send callSpecError"),this._volumeTimeout=0;}};var Zn=1e3,eo=1e4;var to=15,G$1=class extends te{constructor(e,t,i){super();this._mediaSource=null;this._conversation=null;this._myLastRequestedLayouts={};this._state="IDLE";this._participantState=W$1.CALLED;this._participants={};this._transport=null;this._debugInfo=null;this._volumesDetector=null;this._speakerDetector=null;this._localVolumeDetector=null;this._specListener=null;this._activeSpeakerId=null;this._lastSignalledActiveSpeakerId=null;this._serverSettings={camera:null,screenSharing:null};this._lastStalled={};this._remoteAllStalled=!1;this._audioFix=null;this._streamByStreamId=new Map;this._streamIdByStreamDescription=new Map;this._streamWaitTimerByStreamDescription=new Map;this._sequenceNumberByStreamDescription=new Map;this._cooldownTimestampByStreamDescription=new Map;this._cooldownQueueCleanupTimer=null;v$1.create(e,i),ge.create(),this._api=e,this._signaling=t,this._onUnload=()=>{this._conversation&&this._api&&this._api.hangupConversation(this._conversation.id),v$1.destroy(),ge.destroy();},window.addEventListener("unload",this._onUnload),this._audioOutput=new ii,l$1.videoTracksCount>0&&(this._cooldownQueueCleanupTimer=window.setInterval(this._cleanupCooldownQueue.bind(this),Zn)),this._statFirstMediaReceived=new at;}static current(){return G$1._current}static hangupAfterInit(){G$1._activationMutex&&!G$1._current&&(G$1._delayedHangup=!0);}static id(){var e,t;return ((t=(e=G$1._current)==null?void 0:e._conversation)==null?void 0:t.id)||null}onStart(e,t,i,a="",o=!1,s=!1,p){return c(this,null,function*(){if(G$1._activationMutex)throw v$1.log(S$1.ERROR,"startCall"),d.warn("Conversation: there is already running activation"),new F$1(O$1.FAILED);G$1._activationMutex=!0;try{this._mediaSource=this._createMediaSource(),yield this._mediaSource.request(i);let u=this._mediaSource.getMediaSettings();t===Ke.CHAT||e.length>1?this._logWithMediaSettings(S$1.OUTGOING_MULTIPARTY_CALL,u):this._logWithMediaSettings(S$1.OUTGOING_CALL,u);let m=yield this._startConversation(e,t,Je.OUTGOING,i,a,o,s,p);if(!this._conversation)throw new F$1(O$1.UNKNOWN_ERROR);if(this._participantState=W$1.ACCEPTED,this._signaling.changeMediaSettings(u),yield this._processConnection(m),this._allocateTransport(),this._createSpeakerDetector(),this._createSpecListener(),this._signaling.readyToSend(),G$1._delayedHangup)throw new F$1(O$1.CANCELED);d.debug("Outgoing call",{opponentIds:e,opponentType:t,mediaOptions:i});let E=Object.values(this._participants),P;return l$1.batchParticipantsOnStart&&(P=R$1.mapSharedParticipants(E)),yield this._processConnectionSharedMovieInfo(m),g$1.onLocalStream(this._mediaSource.getStream(),this._mediaSource.getMediaSettings()),g$1.onConversation(this._conversation.externalId,this._conversation.mediaModifiers,this._getMuteStatesForCurrentRoom(),P),this._onConversationParticipantListChunk(m),this._processPinnedParticipants(m),g$1.onLocalStatus("WAITING"),this._toggleJoinAvailability(),this._changeFeatureSet(),this._changeNeedRate(),G$1._current=this,this._conversation.concurrent?yield this._acceptConcurrent():l$1.batchParticipantsOnStart||this._setParticipantsStatus(E,"WAITING"),this._conversation}catch(u){throw this._close(u,"Unable to start conversation"),u}finally{G$1._activationMutex=!1;}})}onJoin(e){return c(this,null,function*(){var t;if(G$1._activationMutex)throw v$1.log(S$1.ERROR,"joinCall"),d.warn("Conversation: there is already running activation"),new F$1(O$1.FAILED);G$1._activationMutex=!0,this._state="PROCESSING";try{let i=!!((t=e.observedIds)!=null&&t.length);if(i&&l$1.videoTracksCount>0)throw d.error("Observer mode: please set videoTracksCount=0"),new F$1(O$1.UNSUPPORTED);this._mediaSource=this._createMediaSource(),yield this._mediaSource.request(e.mediaOptions,!i);let a=this._mediaSource.getMediaSettings();this._logWithMediaSettings(S$1.JOIN_CONVERSATION,a);let o=yield this._joinConversation(e);if(!this._conversation)throw new F$1(O$1.UNKNOWN_ERROR);return this._conversation.observer=i,g$1.onLocalStream(this._mediaSource.getStream(),a),this._conversation.waitingHall?(d.log("In waiting hall"),G$1._current=this,G$1._activationMutex=!1,this._signaling.readyToSend(),g$1.onLocalStatus("WAITING_HALL"),this._conversation):this._onJoinPart2(o)}catch(i){throw G$1._activationMutex=!1,this._close(i,"Unable to join conversation"),i}})}_onJoinPart2(e){return c(this,null,function*(){var t,i,a,o,s,p,u;d.debug("Join conversation part 2"),G$1._activationMutex=!0;try{if(this._participantState=W$1.ACCEPTED,!this._conversation||!this._mediaSource)throw new F$1(O$1.UNKNOWN_ERROR);if(this._conversation.observer||this._signaling.changeMediaSettings(this._mediaSource.getMediaSettings()),yield this._processConnection(e),this._allocateTransport(),this._createSpeakerDetector(),this._createSpecListener(),this._signaling.readyToSend(),G$1._delayedHangup)throw new F$1(O$1.CANCELED);let m=Object.values(this._participants),E;l$1.batchParticipantsOnStart&&(E=R$1.mapSharedParticipants(m.filter(D=>!D.isInRoom)));let P=[];if((i=(t=e==null?void 0:e.rooms)==null?void 0:t.rooms)!=null&&i.length)for(let D of e.rooms.rooms)P.push({id:D.id,name:D.name,participantCount:D.participantCount,participantIds:yield Promise.all(((o=(a=D==null?void 0:D.participantIds)==null?void 0:a.map)==null?void 0:o.call(a,this._getExternalIdByParticipantId.bind(this)))||[]),participants:(s=D==null?void 0:D.participants)!=null&&s.participants?this._participantListChunkToExternalChunk(D.participants):void 0,active:D.active,muteStates:D.muteStates});let k=(u=(p=e==null?void 0:e.rooms)==null?void 0:p.roomId)!=null?u:null;if(yield this._processConnectionSharedMovieInfo(e),g$1.onConversation(this._conversation.externalId,this._conversation.mediaModifiers,this._getMuteStatesForCurrentRoom(),E,{rooms:P,roomId:k}),this._onConversationParticipantListChunk(e),this._processPinnedParticipants(e),g$1.onLocalStatus("WAITING"),this._toggleJoinAvailability(),this._changeNeedRate(),this._state="ACTIVE",this._changeFeatureSet(),G$1._current=this,l$1.batchParticipantsOnStart||this._setParticipantsStatus(m,"WAITING"),e.conversation.asrInfo){let D=yield this._getParticipantId(e.conversation.asrInfo.initiatorId);g$1.onAsrStarted(D,e.conversation.asrInfo.movieId);}return this._openTransport(m,!1),this._conversation}catch(m){throw this._close(m,"Unable to join conversation"),m}finally{G$1._activationMutex=!1;}})}onPush(a){return c(this,arguments,function*(e,t=z$1.USER,i){if(G$1._activationMutex)throw d.warn("Conversation: there is already running activation"),new F$1(O$1.REJECTED);G$1._activationMutex=!0;try{let o=yield this._prepareConversation(e,t,i);if(this._mediaSource=this._createMediaSource(),!this._conversation)throw new F$1(O$1.UNKNOWN_ERROR);if(!o.conversation.participants.find(p=>{var u;return p.state===W$1.CALLED&&p.id===((u=this._conversation)==null?void 0:u.userId)}))throw d.log("Push rejected (there is an active call)"),v$1.log(S$1.PUSH,"rejected"),new F$1(O$1.REJECTED);if(yield this._processConnection(o),this._allocateTransport(),this._createSpeakerDetector(),this._createSpecListener(),this._processPinnedParticipants(o),this._signaling.readyToSend(),v$1.log(S$1.PUSH,"accepted"),G$1._current=this,G$1._delayedHangup)throw new F$1(O$1.CANCELED);G$1._activationMutex=!1;}catch(o){throw G$1._activationMutex=!1,this._close(o,"Unable to handle inbound call push"),o}})}_isInWaitingHall(e){if(!e.conversation||(e.conversation.options||[]).indexOf(zi.WAITING_HALL)<0)return !1;let t=(e.conversation.participants||[]).find(i=>R$1.comparePeerId(i.peerId,e.peerId));return t&&t.restricted||!1}_acceptConcurrent(){return c(this,null,function*(){if(!this._mediaSource||!this._conversation)throw new F$1(O$1.UNKNOWN_ERROR);this._state="PROCESSING";let e=this._mediaSource.getMediaSettings();this._logWithMediaSettings(S$1.ACCEPT_CONCURRENT,e),d.debug("Concurrent call",{conversationId:this._conversation.id});try{this._statFirstMediaReceived.markAcceptCall(),yield this._signaling.acceptCall(this._mediaSource.getMediaSettings()),g$1.onCallAccepted(),this._state="ACTIVE",this._participantState=W$1.ACCEPTED,this._changeFeatureSet(),this._openTransport(Object.values(this._participants),!0);}catch(t){this._close(t,"Unable to accept concurrent call");}})}accept(e){return c(this,null,function*(){var t;if(this._state!=="IDLE")throw v$1.log(S$1.ERROR,"acceptIncoming"),d.error("Unable to accept a call - invalid state"),new Error("Unable to accept a call - invalid state");if(!this._mediaSource||!this._conversation)throw new F$1(O$1.UNKNOWN_ERROR);this._state="PROCESSING",d.debug("Accept incoming call",e);try{yield this._mediaSource.request(e);let i=this._mediaSource.getMediaSettings();this._logWithMediaSettings(S$1.ACCEPT_INCOMING,i),this._signaling.changeMediaSettings(i),this._statFirstMediaReceived.markAcceptCall(),yield this._signaling.acceptCall(i),this._participantState=W$1.ACCEPTED;let a=Object.values(this._participants),o;if(l$1.batchParticipantsOnStart&&(o=R$1.mapSharedParticipants(a)),g$1.onCallAccepted(),g$1.onLocalStream(this._mediaSource.getStream(),i),g$1.onConversation(this._conversation.externalId,this._conversation.mediaModifiers,this._getMuteStatesForCurrentRoom(),o),l$1.useParticipantListChunk){let u=yield this._getInitialParticiapntListChunk();(t=u==null?void 0:u.participants)==null||t.forEach(m=>{let E=R$1.composeId(m),P=this._participants[E];P&&(P.movieShareInfos=m.movieShareInfos);}),this._onConversationParticipantListChunk({participants:u});}g$1.onLocalStatus("WAITING"),this._toggleJoinAvailability(),this._changeNeedRate();let s=Nt(this._getMuteStatesForCurrentRoom(),xe.MUTE),p=Nt(this._getMuteStatesForCurrentRoom(),xe.MUTE_PERMANENT);for(let u of [s,p])u.length&&(yield this._processMuteState({mediaOptions:u,stateUpdated:!0}));return this._state="ACTIVE",this._changeFeatureSet(),l$1.batchParticipantsOnStart||this._setParticipantsStatus(a,"WAITING"),this._openTransport(a,!0),this._conversation}catch(i){throw this._close(i,"Unable to accept call"),i}})}decline(){return c(this,null,function*(){var e;if(this._state!=="IDLE")throw v$1.log(S$1.ERROR,"declineIncoming"),d.error("Unable to decline a call - invalid state"),new Error("Unable to decline a call - invalid state");this._state="PROCESSING",d.debug("Decline incoming call"),this._logWithMediaSettings(S$1.DECLINE_INCOMING,(e=this._mediaSource)==null?void 0:e.getMediaSettings()),this._participantState=W$1.HUNGUP,this._signaling.ready&&(yield this._signaling.hangup(O$1.REJECTED)),this._close(new F$1(O$1.REJECTED));})}hangup(){return c(this,null,function*(){d.debug("Hangup");let e=this._state==="ACTIVE"?O$1.HUNGUP:O$1.CANCELED;v$1.log(S$1.HANGUP,e),this._signaling.ready?(yield this._signaling.hangup(e),this._close(new F$1(e))):g$1.onHangup(new F$1(O$1.HUNGUP),this._conversation&&this._conversation.id);})}addParticipant(e,t){return c(this,null,function*(){if(!this._signaling.ready){this._close(new F$1(O$1.UNKNOWN_ERROR),"Unable to add participant");return}let i=yield this._signaling.addParticipant(e,t),a=null;i.type==="error"&&(i.error==="call-unfeasible"?a=i.status:a=O$1.UNKNOWN_ERROR);let o=i.participant;yield this._onAddParticipant(R$1.composeId(o),o,a);})}removeParticipant(e,t=!1){return c(this,null,function*(){this._signaling.ready&&(yield this._signaling.removeParticipant(e,t),this._onRemoveParticipant(e));})}setVolume(e){this._audioOutput.volume=e;}updateStatisticsInterval(){this._transport&&this._transport.updateStatisticsInterval();}_openTransport(e,t){var a;if(!this._transport)return;let i=[];for(let o of e)(o.state===W$1.CALLED||o.state===W$1.ACCEPTED)&&(this._transport.isAllocated(o.id)||this._transport.allocate(o.id,t)),o.state===W$1.ACCEPTED&&i.push(o.id);i.length&&this._transport.open(i,null,!!((a=this._conversation)!=null&&a.observer));}_close(e,t){t&&d.error(t,e),d.debug("Close conversation",e),e.error?this._signaling.ready&&this._signaling.hangup(O$1.FAILED):v$1.log(S$1.ERROR,e.hangup),G$1._activationMutex=!1;let i=this._conversation&&this._conversation.id;if([O$1.CANCELED,O$1.NOT_FRIENDS,O$1.CALLEE_IS_OFFLINE,O$1.CALLER_IS_BLOCKED,O$1.CALLER_IS_REJECTED].indexOf(e.hangup)!==-1||e.hangup===O$1.REJECTED&&!e.remote){g$1.onHangup(e,i),this.destroy();return}if(e.hangup===O$1.HUNGUP&&(!e.remote||this._participantState===W$1.CALLED)){g$1.onHangup(e,i),this.destroy();return}if(e.hangup===O$1.MISSED&&!e.remote){g$1.onHangup(e,i),this.destroy();return}if((e.hangup===O$1.SOCKET_CLOSED||e.hangup===O$1.NOT_FOUND)&&G$1._current&&!this._conversation){this._cleanupSignaling(),this._cleanupMediaSource();return}if(e.hangup===O$1.BUSY&&!e.remote){this._cleanupSignaling(),this._cleanupMediaSource();return}this._state="CLOSE",this._participantState=W$1.HUNGUP,this._changeFeatureSet(),this._cleanupMediaSource(),this._cleanupParticipants(),this._cleanupParticipantAgnosticStreams(),this._cleanupTransport(),this._cleanupSpeakerDetector(),this._cleanupSpecListener(),this._cleanupSignaling(),this._api.cleanup(),v$1.destroy(),ge.destroy(),this._conversation=null,this._myLastRequestedLayouts={},G$1._current=null,G$1._delayedHangup=!1,g$1.onHangup(e||new F$1(O$1.UNKNOWN_ERROR),i),this._cooldownQueueCleanupTimer!==null&&(window.clearInterval(this._cooldownQueueCleanupTimer),this._cooldownQueueCleanupTimer=null);}destroy(){let e=this._conversation&&this._conversation.id;d.debug("Destroy conversation",{conversationId:e}),this._cleanupMediaSource(),this._cleanupParticipants(),this._cleanupParticipantAgnosticStreams(),this._cleanupTransport(),this._cleanupSpeakerDetector(),this._cleanupSpecListener(),this._cleanupSignaling(),this._api.cleanup(),this._cleanupListeners(),v$1.destroy(),ge.destroy(),this._conversation=null,this._myLastRequestedLayouts={},G$1._current=null,G$1._delayedHangup=!1,this._cooldownQueueCleanupTimer!==null&&(window.clearInterval(this._cooldownQueueCleanupTimer),this._cooldownQueueCleanupTimer=null);}_getConversationParams(e){return c(this,null,function*(){let t=yield this._api.getConversationParams(e);d.debug("Api.getConversationParams",t);let i=[],{turn_server:a,stun_server:o}=t;if(o&&i.push(o),a){let s=a.urls.filter((p,u,m)=>m.indexOf(p)===u);s.push(`${s[s.length-1]}?transport=tcp`),i.push({urls:s,username:a.username,credential:a.credential});}return l$1.iceServers=i,l$1.wssBase=t.endpoint,l$1.wssToken=t.token,t.client_type&&(l$1.clientType=t.client_type),l$1.externalUserType=t.external_user_type,t})}_addGeoParamsToEndpoint(e,t){return t.isp_as_no&&(e+=`&ispAsNo=${t.isp_as_no}`),t.isp_as_org&&(e+=`&ispAsOrg=${t.isp_as_org}`),t.loc_cc&&(e+=`&locCc=${t.loc_cc}`),t.loc_reg&&(e+=`&locReg=${t.loc_reg}`),e}_startConversation(e,t,i,a,o="",s=!1,p=!1,u){return c(this,null,function*(){let m=R$1.uuid();d.debug("Conversation: start",{conversationId:m,opponentIds:e,opponentType:t,direction:i});let E=a.includes(de.VIDEO),P=yield this._api.startConversation(m,e,t,E,o,s,p,{onlyAdminCanShareMovie:u});d.debug("Api.startConversation",P);let k=yield this._getConversationParams(P.id);P.endpoint=this._addGeoParamsToEndpoint(P.endpoint,k);let D=yield this._connectSignaling($e.START,P);return yield this._setConversation(P,D,i),D})}_joinConversation(e){return c(this,null,function*(){let{conversationId:t,mediaOptions:i,chatId:a,joinLink:o,observedIds:s,payload:p}=e;d.debug("Conversation: join",{conversationId:t,joinLink:o,observedIds:s});let u=i.includes(de.VIDEO),m;if(t)m=yield this._api.joinConversation(t,u,a);else if(o)m=yield this._api.joinConversationByLink(o,u,s,p);else throw new F$1(O$1.UNKNOWN_ERROR);d.debug("Api.joinConversation",m),yield this._getConversationParams(m.id),this._statFirstMediaReceived.measureSignalingConnection();let E=yield this._connectSignaling($e.JOIN,m);return this._statFirstMediaReceived.measureSignalingConnection(E),yield this._setConversation(m,E,Je.JOINING),E})}_prepareConversation(a){return c(this,arguments,function*(e,t=z$1.USER,i){d.debug("Conversation: push",{conversationId:e,type:t,peerId:i});let o=this._api.getUserId();if(!o)throw new F$1(O$1.UNKNOWN_ERROR);let s=yield this._getConversationParams(e),p=s.device_idx||0,u=`${l$1.wssBase}?userId=${o}&entityType=${t}&deviceIdx=${p}&conversationId=${e}&token=${l$1.wssToken}`;u=this._addGeoParamsToEndpoint(u,s);let m={id:e,peerId:i,endpoint:u,is_concurrent:!1,p2p_forbidden:!1,device_idx:p},E=yield this._connectSignaling($e.ACCEPT,m);return G$1._current&&(G$1._current._participantState===W$1.ACCEPTED||G$1._current._participantState===W$1.CALLED)?(d.log("Push rejected (busy)"),v$1.log(S$1.PUSH,"busy"),this._signaling.ready&&this._signaling.hangup(O$1.BUSY),Promise.reject({hangup:O$1.BUSY})):(G$1._current&&(G$1._current.destroy(),G$1._current=null),yield this._setConversation(m,E,Je.INCOMING,t),E)})}_createParticipant(e){return c(this,null,function*(){var i;let t=Object.assign({id:null,externalId:null,mediaSettings:he(),participantState:{},state:W$1.CALLED,status:null,remoteStream:null,mediaSource:null,platform:null,clientType:null,roles:[],networkRating:1,lastRequestedLayouts:{},muteStates:{},unmuteOptions:[],observedIds:[],isInRoom:!1},e);if(e.externalId){let a=R$1.decomposeParticipantId(t.id).compositeUserId;this._api.cacheExternalId(a,e.externalId);}else t.externalId=yield this._getParticipantId(t.id);return (i=t.observedIds)!=null&&i.length&&(t.externalId.observer=!0),this._setParticipantMarkers(t,t.markers),t})}_getParticipantId(e){return c(this,null,function*(){try{let t=R$1.decomposeParticipantId(e),i=yield this._api.userId(t.compositeUserId);return Object.assign({deviceIdx:t.deviceIdx},i)}catch(t){throw this._close(new F$1(O$1.NETWORK_ERROR),t),t}})}_setConversation(o,s,p){return c(this,arguments,function*(e,t,i,a=z$1.USER){yield this._prepareParticipants(t.conversation.participants);let u=this._api.getUserId(),m=e.device_idx||0;if(!u){let k=(t.conversation.participants||[]).find(D=>R$1.comparePeerId(D.peerId,t.peerId));if(!k)throw new F$1(O$1.UNKNOWN_ERROR);u=Number(k.id),k.idType&&(a=k.idType),k.deviceIdx&&(m=k.deviceIdx),this._api.setUserId(u);}let E=R$1.composeParticipantId(u,a,m),P=yield this._getParticipantId(E);this._conversation={userId:u,compositeUserId:E,externalId:P,acceptTime:t.conversation.acceptTime,features:t.conversation.features||[],featuresPerRole:t.conversation.featuresPerRole,id:t.conversation.id||e.id,participantsLimit:t.conversation.participantsLimit||30,topology:t.conversation.topology||"DIRECT",direction:i,concurrent:t.isConcurrent||e.is_concurrent||!1,needRate:!1,chatId:t.conversation.multichatId,roles:[],recordsInfoByRoom:new Map,muteStates:new Map,joinLink:e.join_link,pinnedParticipantIdByRoom:new Map,mediaModifiers:t.mediaModifiers,options:[],unmuteOptions:[],networkRating:1,waitingHall:this._isInWaitingHall(t),observer:!1,asrInfo:t.conversation.asrInfo||null,roomId:null},this._signaling.setConversationId(this._conversation.id),e.p2p_forbidden&&(l$1.forceRelayPolicy=e.p2p_forbidden),v$1.log(S$1.RELAY_POLICY,l$1.forceRelayPolicy?"1":"0"),this._changeFeatureSet(),this._logDevices();})}_updateConversation(e){if(!this._conversation)throw new F$1(O$1.UNKNOWN_ERROR);this._conversation.acceptTime=e.conversation.acceptTime,this._conversation.features=e.conversation.features||[],this._conversation.featuresPerRole=e.conversation.featuresPerRole,this._conversation.participantsLimit=e.conversation.participantsLimit||30,this._conversation.topology=e.conversation.topology||"DIRECT",this._conversation.concurrent=e.isConcurrent||!1,this._conversation.chatId=e.conversation.multichatId,this._conversation.mediaModifiers=e.mediaModifiers,this._conversation.waitingHall=!1;}_createMediaSource(){let e=new fi;return this.subscribe(e,"SOURCE_CHANGED",this._onLocalMediaStreamChanged.bind(this)),this.subscribe(e,"SCREEN_STATUS",this._onScreenSharingStatus.bind(this)),this._audioFix=new Ut(e),e}_connectSignaling(e,t){return c(this,null,function*(){return this._signaling.setEndpoint(t.endpoint),this.subscribe(this._signaling,ve.NOTIFICATION,this._onSignalingNotification.bind(this)),this.subscribe(this._signaling,ve.FAILED,this._onSignalingFailed.bind(this)),this.subscribe(this._signaling,ve.RECONNECT,this._onSignalingReconnect.bind(this)),this._signaling.connect(e,t)})}_processConnection(e){return c(this,null,function*(){yield this._registerConnectionParticipants(e),this._processConnectionData(e);})}_prepareParticipants(e){return c(this,null,function*(){let t=e.map(i=>i.id);t.length&&(yield this._api.prepareUserIds(t));})}_onConversationParticipantListChunk(e){let t=e.participants;t&&g$1.onConversationParticipantListChunk(this._participantListChunkToExternalChunk(this._createParticipantListChunk(t)));}_createParticipantListChunk(e){return Re(Re({},{participants:[],countBefore:0,countAfter:0,markerFound:!1}),e)}_participantListChunkToExternalChunk(e){let t=R$1.mapSharedParticipants(e.participants.map(i=>{let a=R$1.composeId(i);return this._participants[a]}));return ze(Re({},e),{participants:t})}_registerConnectionParticipants(e){return c(this,null,function*(){var i,a,o,s,p,u;yield this._registerParticipants(e.conversation.participants),(i=e.participants)!=null&&i.participants&&(yield this._registerParticipants((a=e.participants)==null?void 0:a.participants));let t=(s=(o=e==null?void 0:e.rooms)==null?void 0:o.rooms)!=null?s:[];for(let m of t)yield this._registerParticipants((u=(p=m==null?void 0:m.participants)==null?void 0:p.participants)!=null?u:[],!0);})}_registerParticipants(e,t=!1){return c(this,null,function*(){if(this._conversation)for(let i of e){let a=R$1.composeId(i);if(this._isMe(a)){this._conversation.roles=i.roles||[],this._conversation.roles.length&&(d.debug(`Local roles changed: ${i.roles}`),g$1.onLocalRolesChanged(this._conversation.roles)),yield this._registerParticipantLocalMuteState(i);continue}if(i.state===W$1.HUNGUP||i.state===W$1.REJECTED){this._participants[i.id]&&this._removeParticipant(this._participants[i.id],O$1.HUNGUP);continue}this._registerParticipantInCache(yield this._createParticipant({id:a,externalId:i.externalId&&ue.fromSignaling(i.externalId,i.deviceIdx||0),mediaSettings:he(i.mediaSettings),participantState:R$1.mapParticipantState(i),state:i.state,roles:i.roles||[],status:l$1.batchParticipantsOnStart?"WAITING":null,muteStates:i.muteStates||{},unmuteOptions:i.unmuteOptions||[],observedIds:i.observedIds||[],markers:this._denormalizeMarkers(a,i.markers),movieShareInfos:i.movieShareInfos,isInRoom:t})),i.roles&&i.roles.length&&(d.debug(`Roles for participant [${a}] changed: ${i.roles}`),g$1.onRolesChanged(this._participants[a].externalId,i.roles));}})}_registerParticipantLocalMuteState(e){return c(this,null,function*(){if(!e.muteStates)return Promise.resolve();let t=Nt(e.muteStates,xe.MUTE),i=Nt(e.muteStates,xe.MUTE_PERMANENT);for(let a of [t,i])a.length&&(yield this._onMuteParticipant({muteStates:e.muteStates,unmuteOptions:e.unmuteOptions,mediaOptions:a,stateUpdated:!0}));})}_getStatusByTransportState(e){let t;return e==="CONNECTED"?t="CONNECTED":e==="CONNECTING"||e==="OPENED"?t="CONNECTING":e==="RECONNECTING"&&(t="RECONNECT"),t}_registerParticipantInCache(e){return this._participants[e.id]=e}_getExistedParticipantByIdOrCreate(e){return c(this,null,function*(){return this._participants[e]||this._createParticipant({id:e})})}_getExternalIdByParticipantId(e){return c(this,null,function*(){var t;if(this._isMe(e))return this._conversation.externalId;if(l$1.useParticipantListChunk)return (yield this._getExistedParticipantByIdOrCreate(e)).externalId;if((t=this._participants[e])!=null&&t.externalId)return this._participants[e].externalId;{let i=yield this._getParticipantId(e);return this._api.cacheExternalId(e,i),i}})}_registerParticipantAndSetMarkersIfChunkEnabled(e,t){return c(this,null,function*(){if(l$1.useParticipantListChunk){let i=this._registerParticipantInCache(yield this._getExistedParticipantByIdOrCreate(e));return this._setParticipantMarkers(i,t),i}return this._participants[e]})}_warnParticipantNotInConversation(e){d.warn(`Participant [${e}] isn't in conversation`);}_setParticipantMarkers(e,t){return e.markers=this._denormalizeMarkers(e.id,t),e}_denormalizeMarkers(e,t){if(!t)return null;let i=Object.values(t).find(a=>"ts"in a&&"rank"in a);return Object.entries(t).reduce((a,[o,s])=>(a[o]=ze(Re(Re({},i),s),{id:e}),a),{})}_processConnectionData(e){this._processRooms(e),this._processMuteStates(e),this._processRecordInfos(e),this._onOptionsChanged(e.conversation.options),e.chatRoom&&e.chatRoom.totalCount&&this._onChatRoomUpdated($i.ATTENDEE,e.chatRoom.totalCount,e.chatRoom.firstParticipants);}_processRooms(e){var i,a;let t=(a=(i=e.rooms)==null?void 0:i.roomId)!=null?a:null;this._onRoomSwitched(t,!0);}_processMuteStates(e){var i,a,o;this._setMuteStatesForRoomId((i=e.conversation)==null?void 0:i.muteStates,null);for(let s of (o=(a=e.rooms)==null?void 0:a.rooms)!=null?o:[])this._setMuteStatesForRoomId(s.muteStates,s.id);let t=this._getMuteStatesForCurrentRoom();this._onMuteParticipant({muteStates:t,unmuteOptions:e.unmuteOptions,mediaOptions:Object.keys(t),muteAll:!0,stateUpdated:!0,roomId:this._conversation.roomId});}_processRecordInfos(e){var t,i,a,o;this._onRecordInfo((t=e.conversation.recordInfo)!=null?t:null);for(let s of (a=(i=e.rooms)==null?void 0:i.rooms)!=null?a:[])this._onRecordInfo((o=s.recordInfo)!=null?o:null,s.id);}_processPinnedParticipants(e){var t,i;e.conversation.pinnedParticipantId?this._onPinParticipant(e.conversation.pinnedParticipantId):this._conversation.pinnedParticipantIdByRoom.delete(null);for(let a of (i=(t=e.rooms)==null?void 0:t.rooms)!=null?i:[])a.pinnedParticipantId?this._onPinParticipant(a.pinnedParticipantId,!1,null,a.id):this._conversation.pinnedParticipantIdByRoom.delete(a.id);}_allocateTransport(){if(!this._conversation||!this._mediaSource)return;this._transport=new xi(this._conversation.topology,this._signaling,this._mediaSource,this._serverSettings),this._debugInfo=new ri,this.subscribe(this._transport,"STATE_CHANGED",this._onTransportStateChanged.bind(this)),this.subscribe(this._transport,"LOCAL_STATE_CHANGED",this._onTransportLocalStateChanged.bind(this)),this.subscribe(this._transport,"REMOTE_TRACK_ADDED",this._onRemoteTrackAdded.bind(this)),this.subscribe(this._transport,"REMOTE_TRACK_REMOVED",this._onRemoteTrackRemoved.bind(this)),this.subscribe(this._transport,"REMOTE_ALL_STALL",this._onRemoteAllStall.bind(this)),this.subscribe(this._transport,"REMOTE_DATA_STATS",this._onRemoteDataStats.bind(this)),this.subscribe(this._transport,"SIGNALLED_STALLED_PARTICIPANTS",this._onRemoteSignalledStall.bind(this)),this.subscribe(this._transport,"TOPOLOGY_CHANGED",this._onTopologyChanged.bind(this)),this.subscribe(this._transport,"NETWORK_STATUS",this._onNetworkStatus.bind(this)),this.subscribe(this._transport,"REMOTE_STREAM_SECOND",this._onRemoteStreamSecond.bind(this)),this.subscribe(this._transport,"PEER_CONNECTION_CLOSED",this._onPeerConnectionClosed.bind(this)),this.subscribe(this._transport,"ASR_TRANSCRIPTION",this._onAsrTranscription.bind(this)),this.subscribe(this._transport,"ANIMOJI_STREAM",this._onAnimojiStream.bind(this));let e=this._conversation.direction===Je.OUTGOING&&!this._conversation.concurrent;for(let t of Object.values(this._participants))(t.state===W$1.ACCEPTED||t.state===W$1.CALLED)&&this._transport.allocate(t.id,e);}_createSpeakerDetector(){this._transport&&(this._volumesDetector=new Li(this._transport),this.subscribe(this._volumesDetector,"VOLUMES_DETECTED",this._onVolumesDetected.bind(this)),this._speakerDetector=new Ni(this._volumesDetector,this._transport,this._conversation.topology),this.subscribe(this._speakerDetector,"SPEAKER_CHANGED",this._onSpeakerChanged.bind(this)),this._localVolumeDetector=new ai(this._mediaSource));}_createSpecListener(){this._transport&&this._volumesDetector&&(this._specListener=new ni(this._transport,this._volumesDetector,this._participants));}_logDevices(){let e=b$1.getCameras().length,t=b$1.getMicrophones().length;d.debug("Cameras: "+e+(b$1.hasCameraPermission()?"✔":"✖")+", Microphones: "+t+(b$1.hasMicrophonePermission()?"✔":"✖")),v$1.log(S$1.DEVICES,`${e}_${t}`);}_logWithMediaSettings(e,t){v$1.log(e,[(t==null?void 0:t.isAudioEnabled)&&"audio",(t==null?void 0:t.isVideoEnabled)&&"video"].filter(Boolean).join("_"));}_removeParticipant(e,t){var i;e.state===W$1.CALLED||e.state===W$1.ACCEPTED||this._state==="CLOSE"||(e.id===this._lastSignalledActiveSpeakerId&&(this._lastSignalledActiveSpeakerId=null),this._participants[e.id]&&(t===O$1.HUNGUP?this._setParticipantsStatus([e],"HANGUP"):this._setParticipantsStatus([e],"ERROR",t),(i=e.mediaSource)==null||i.disconnect(),this._conversation&&this._conversation.pinnedParticipantIdByRoom.get(null)===e.id&&this._conversation.pinnedParticipantIdByRoom.delete(null),this._conversation&&this._conversation.roomId&&this._conversation.pinnedParticipantIdByRoom.get(this._conversation.roomId)===e.id&&this._conversation.pinnedParticipantIdByRoom.delete(this._conversation.roomId),this.updateDisplayLayout([{uid:e.externalId,mediaType:"CAMERA",stopStream:!0}]),delete this._participants[e.id],g$1.onRemoteRemoved(e.externalId,e.markers)));}_cleanupListeners(){this.unsubscribe(),window.removeEventListener("unload",this._onUnload);}_cleanupMediaSource(){this._mediaSource&&(this._mediaSource.destroy(),this._mediaSource=null);}_cleanupParticipants(){Object.values(this._participants).forEach(e=>{var t,i,a;(t=e.remoteStream)==null||t.getTracks().forEach(o=>o.stop()),(i=e.secondStream)==null||i.getTracks().forEach(o=>o.stop()),(a=e.mediaSource)==null||a.disconnect();}),this._participants={},this._audioOutput&&this._audioOutput.destroy();}_cleanupParticipantAgnosticStreams(){d.debug("cleaning up participant-agnostic streams"),this._streamByStreamId.forEach(e=>{e.getTracks().forEach(t=>{t.stop();});}),this._streamByStreamId=new Map,this._streamWaitTimerByStreamDescription.forEach(e=>{window.clearTimeout(e);}),this._streamWaitTimerByStreamDescription=new Map,this._streamIdByStreamDescription=new Map,this._sequenceNumberByStreamDescription=new Map,this._cooldownTimestampByStreamDescription=new Map;}_cleanupTransport(){this._transport&&(this._transport.destroy(),this._transport=null),this._debugInfo&&(this._debugInfo=null);}_cleanupSpeakerDetector(){this._speakerDetector&&(this._speakerDetector.destroy(),this._speakerDetector=null),this._volumesDetector&&(this._volumesDetector.destroy(),this._volumesDetector=null),this._localVolumeDetector&&(this._localVolumeDetector.destroy(),this._localVolumeDetector=null);}_cleanupSpecListener(){this._specListener&&(this._specListener.destroy(),this._specListener=null);}_cleanupSignaling(){this._signaling.close(),this._signaling.cleanup();}_onAddParticipant(e,t,i){return c(this,null,function*(){d.debug(`Add new participant [${e}]`);let a=this._participants[e];if(a&&(a.state===W$1.ACCEPTED||a.state===W$1.CALLED)){d.warn(`Participant [${a.id}:${a.state}] is already in conversation`);return}a||(a=this._registerParticipantInCache(yield this._createParticipant({id:e,externalId:t.externalId&&ue.fromSignaling(t.externalId,t.deviceIdx||0),mediaSettings:he(t.mediaSettings),state:t.state,roles:t.roles||[],muteStates:t.muteStates||{},unmuteOptions:t.unmuteOptions||[],observedIds:t.observedIds||[]}))),this._setParticipantsStatus([a],"WAITING"),i?(a.state=W$1.HUNGUP,this._removeParticipant(a,i)):this._transport&&(a.state=W$1.CALLED,this._transport.allocate(a.id,!0),v$1.log(S$1.ADD_PARTICIPANT),this._invokeRolesChangedCallbackIfNeeded(a));})}_onRemoveParticipant(e){d.debug(`Remove participant [${e}]`);let t=[];for(let i=0;i<=to;i++){let a=R$1.compose(e,i),o=this._participants[a];o&&t.push(o);}if(!t.length){this._warnParticipantNotInConversation(e);return}if(this._transport)for(let i of t)this._transport.close(i.id);v$1.log(S$1.REMOVE_PARTICIPANT);}changeDevice(e){return c(this,null,function*(){return e==="audiooutput"?this._audioOutput.changeOutput():this._mediaSource?(e==="audioinput"&&(this._audioFix=new Ut(this._mediaSource)),this._mediaSource.changeDevice(e)):Promise.reject(ie.UNKNOWN)})}stopVideoTrack(){return this._mediaSource.stopVideoTrack()}toggleScreenCapturing(e){return c(this,null,function*(){return this._mediaSource?this._mediaSource.toggleScreenCapturing(e):Promise.reject(ie.UNKNOWN)})}disableScreenCapturing(){return c(this,null,function*(){return this._mediaSource?this._mediaSource.disableScreenCapturing():Promise.reject(ie.UNKNOWN)})}toggleAnimojiCapturing(e){this._mediaSource&&this._mediaSource.toggleAnimojiCapturing(e);}setAnimojiSvg(e,t=null,i=null){if(!this._transport)return;let a=!t,o=t!=null?t:this._conversation.compositeUserId;if(e instanceof ArrayBuffer){let s=i!=null?i:this._conversation.externalId.id;this._transport.setAnimojiSvg(o,{svg:e,userId:s,isMe:a});return}this._transport.setAnimojiSvg(o,{svg:e,isMe:a});}setVideoStream(e,t=!1){return c(this,null,function*(){if(this._mediaSource)return this._mediaSource.setVideoStream(e,t)})}setAudioStream(e){return c(this,null,function*(){if(this._mediaSource)return this._mediaSource.setAudioStream(e)})}toggleLocalVideo(e){return c(this,null,function*(){if(this._mediaSource)return v$1.log(S$1.MEDIA_STATUS,e?"video_1":"video_0"),this._mediaSource.toggleVideo(e)})}toggleLocalAudio(e){return c(this,null,function*(){if(this._mediaSource)return v$1.log(S$1.MEDIA_STATUS,e?"audio_1":"audio_0"),this._mediaSource.toggleAudio(e)})}changePriorities(e){return c(this,null,function*(){if(e.length<2||!this._signaling.ready)return;let t={},i={};for(let a of e){let o=typeof a.uid=="object"?a.uid:ue.fromId(a.uid),s=ue.toString(o);i[s]=a.priority;}for(let a of Object.values(this._participants)){let o=ue.toString(a.externalId);i.hasOwnProperty(o)&&(t[a.id]=i[o]);}yield this._signaling.changePriorities(t);})}changeParticipantState(e){return c(this,null,function*(){for(let[t,i]of Object.entries(e))if(t.length>5||i.length>5)throw new Error("key/value max length is 5 chars, mappings with empty values (null or empty string) are discarded");yield this._signaling.changeParticipantState(e);})}requestKeyFrame(e){return c(this,null,function*(){let t={};return t[He(e)]={keyFrameRequested:!0},this._signaling.updateDisplayLayout(t)})}requestTestMode(e,t){return c(this,null,function*(){return this._signaling.requestTestMode(e,t)})}updateDisplayLayout(e){return c(this,null,function*(){if(e.length<1||!this._signaling.ready)return;d.log(`Update display layout [${this._signaling.getNextCommandSequenceNumber()}]`,e);let t={};for(let a of e){let o=typeof a.uid=="object"?a.uid:ue.fromId(a.uid),s=this._api.getCachedOkIdByExternalId(o);if(!s){let E=ue.toString(o);d.log(`Unknown participant external ID ${E}`);continue}let p=R$1.compose(s,o.deviceIdx),u=He({participantId:p,mediaType:a.mediaType,streamName:a.streamName}),m=this._participants[p];m?m.lastRequestedLayouts[u]=a:this._isMe(p)&&(this._myLastRequestedLayouts[u]=a),Lt(a)?(this._isMe(p)&&delete this._myLastRequestedLayouts[u],this._streamIdByStreamDescription.has(u)&&!this._cooldownTimestampByStreamDescription.has(u)&&this._cooldownTimestampByStreamDescription.set(u,Date.now())):(this._cooldownTimestampByStreamDescription.delete(u),!this._streamIdByStreamDescription.has(u)&&l$1.videoTracksCount>0&&this._streamIdByStreamDescription.set(u,null),t[u]=a),a.mediaType==="SCREEN"&&!Lt(a)&&Ve(kt(p));}let i=this._cooldownTimestampByStreamDescription.keys();for(;this._streamIdByStreamDescription.size>l$1.videoTracksCount;){let a=i.next();if(a.done){d.error("Cannot accommodate all streaming requests: tracks available "+l$1.videoTracksCount+"; requested streams: "+Array.from(this._streamIdByStreamDescription.keys()));break}this._stopStreaming(a.value),t[a.value]={stopStream:!0};}yield this._sendUpdateDisplayLayout(t);})}feedback(e){return this._signaling.feedback(e)}_stopStreaming(e){if(this._cooldownTimestampByStreamDescription.delete(e),this._sequenceNumberByStreamDescription.set(e,this._signaling.getNextCommandSequenceNumber()),this._streamWaitTimerByStreamDescription.has(e)&&(d.log("Client asked to stop streaming before stream became available",e),window.clearTimeout(this._streamWaitTimerByStreamDescription.get(e)),this._streamWaitTimerByStreamDescription.delete(e)),this._streamIdByStreamDescription.get(e)){let i=ti(e),a=this._participants[i.participantId],{externalId:o}=this._conversation,s=this._isMe(i.participantId);if(a){if(i.streamName&&(i.mediaType==="STREAM"||i.mediaType==="MOVIE")){let p={stream:null,streamName:i.streamName,mediaType:i.mediaType};s?g$1.onLocalLive(o,p):g$1.onRemoteLive(a.externalId,p);}else s||g$1.onRemoteStream(a.externalId,null);v$1.log(S$1.PAT_DEALLOCATED);}else d.log(`Cannot find participant to stop streaming: ${i.participantId}`);}this._streamIdByStreamDescription.delete(e);}_sendUpdateDisplayLayout(e){return c(this,null,function*(){if(Object.keys(e).length===0)return;let t=yield this._signaling.updateDisplayLayout(e);if(!t)return;let i=[];for(let[a,o]of Object.entries(t.errorCodeByParticipantId||{})){let s=ti(a),p=this._participants[s.participantId];if(p){let u;typeof o!="number"?(d.warn(`Unexpected error code ${o} received for participant ${s.participantId}`),u=ea.UNKNOWN_ERROR):u=ta(o),i.push({externalId:p.externalId,errorReason:u});}}if(i&&i.length)throw new oi("Could not allocate one or more participants",i)})}_cleanupCooldownQueue(){let e={},t=this._cooldownTimestampByStreamDescription.entries();do{let i=t.next();if(i.done)break;let a=i.value;if(a[1]+eo>Date.now())break;let s=a[0];this._stopStreaming(s),e[s]={stopStream:!0};}while(!0);this._sendUpdateDisplayLayout(e);}_onParticipantSourcesUpdate(e){if(this._conversation){d.log("Received participant sources update notification",e);for(let t of e)this._waitForStreamIfNeeded(t);}}_onParticipantPromoted(e){return c(this,null,function*(){d.log("Promoted in waiting hall",!e.demote),e.demote?(d.log("Kicked from waiting hall"),this._close(new F$1(O$1.REMOVED))):(this._updateConversation(e),yield this._onJoinPart2(e));})}_onChatRoomUpdated(a){return c(this,arguments,function*(e,t=0,i=[]){d.log(`Chat room updated: ${e}`);let o=[],s=[];i.length&&(i.forEach(p=>{if(p.externalId){let u=fe.fromSignaling(p.externalId);o.push(u),this._api.cacheExternalId(p.id.id,u);}else s.push(R$1.decomposeId(p.id.id).id);}),s.length&&!o.length&&(o=yield this._api.getExternalIdsByOkIds(s))),g$1.onChatRoomUpdated(e,t,o);})}_onSharedMovieUpdate(e){return c(this,null,function*(){let{externalId:t}=this._conversation,{data:i}=e;for(let a of i)if(this._isMe(a.participantId))g$1.onLocalLiveUpdate(t,a);else {let s=yield this._getExternalIdByParticipantId(a.participantId);s&&g$1.onRemoteLiveUpdate(s,a);}})}_onSharedMovieInfoStarted(e){return c(this,null,function*(){d.log(`Shared movie started data received: ${e.notification}`),yield this._processSharedMovieInfo(e.movieShareInfo);})}_processSharedMovieInfos(e){return c(this,null,function*(){e&&(yield Promise.all(e.map(t=>this._processSharedMovieInfo(t))));})}_processSharedMovieInfo(e){return c(this,null,function*(){if(!e)return;let{externalId:t}=this._conversation;if(this._isMe(e.initiatorId))g$1.onLocalSharedMovieInfo(t,e);else {let a=yield this._getExternalIdByParticipantId(e.initiatorId);a&&g$1.onRemoteSharedMovieInfo(a,e);}this._forceOpenTransportForAloneInCall();})}_processConnectionSharedMovieInfo(e){return c(this,null,function*(){let t=e.conversation.participants.find(i=>this._isMe(R$1.composeId(i)));yield this._processSharedMovieInfos(t==null?void 0:t.movieShareInfos);})}_onSharedMovieInfoStopped(e){return c(this,null,function*(){d.log(`Shared movie stopped data received: ${e.notification}`);let{externalId:t}=this._conversation,{initiatorId:i,movieId:a,source:o}=e,s={initiatorId:i,movieId:a,source:o};if(this._isMe(i))g$1.onLocalSharedMovieStoppedInfo(t,s);else {let u=yield this._getExternalIdByParticipantId(i);u&&g$1.onRemoteSharedMovieStoppedInfo(u,s);}})}_onFeaturesPerRoleChanged(e){d.log(`Features per role changed: ${e.notification}`),g$1.onFeaturesPerRoleChanged(e.featuresPerRole);}_waitForStreamIfNeeded(e){var m,E;let t=this._matchStreamDescription(e.participantStreamDescription);if(!t||t.mediaType==="ANIMOJI")return;let i=t.participantId,a=this._participants[i];if(l$1.producerScreenDataChannel&&t.mediaType==="SCREEN"&&!e.fastScreenShare){d.log("skipping participant-sources-update notification since screenshare will be received over datachannel");return}let o=He(t),s=this._sequenceNumberByStreamDescription.get(o);if(s&&s>e.sequenceNumber){d.warn(`Participant ${t.participantId} received outdated PAT response: sequence number ${e.sequenceNumber}; last sent sequence number for given participant is ${s}`),v$1.log(S$1.PAT_OUTDATED_RESPONSE);return}let p=e.streamId,u=e.rtpTimestamp?this._getWaitingTime(p,e.rtpTimestamp):0;if(u<=0){this._streamWaitTimerByStreamDescription.delete(o);let{externalId:P}=this._conversation,k=this._isMe(i);if(!a&&!k){v$1.log(S$1.PAT_ERROR,"participantMissing"),d.error(`Could not find participant by ID: ${i}`);return}let D=k?P:a.externalId,q=this._streamByStreamId.get(p);if(!q){v$1.log(S$1.PAT_ERROR,"streamNotFound"),d.error(`Could not find stream by ID: ${p}`);return}v$1.log(S$1.PAT_ALLOCATED),this._streamIdByStreamDescription.set(o,p);let j=(m=e.participantStreamDescription)==null?void 0:m.mediaType;if(j==="STREAM"||j==="MOVIE"){if((E=e.participantStreamDescription)!=null&&E.streamName){let Y={streamName:e.participantStreamDescription.streamName,stream:q,mediaType:j};k?g$1.onLocalLive(D,Y):g$1.onRemoteLive(D,Y);}}else if(l$1.producerScreenTrack&&j==="SCREEN")g$1.onRemoteScreenStream(a.externalId,q);else if(!k){let Y=(l$1.producerScreenTrack?null:a.secondStream)||q;g$1.onRemoteStream(a.externalId,Y);}}else {d.debug(`Waiting for ${u} until stream ${p} for ${o} is switched`);let P=window.setTimeout(this._waitForStreamIfNeeded.bind(this,e),u);this._streamWaitTimerByStreamDescription.set(o,P);}}_matchStreamDescription(e){if(!e)return null;if(this._streamIdByStreamDescription.has(He(e)))return e;let t=e.participantId;if(e.mediaType){let i={participantId:t,mediaType:null};if(this._streamIdByStreamDescription.has(He(i)))return i}else {let i={participantId:t,mediaType:"CAMERA"};if(this._streamIdByStreamDescription.has(He(i)))return i;let a={participantId:t,mediaType:"SCREEN"};if(this._streamIdByStreamDescription.has(He(a)))return a}return d.error("Received unrequested allocation",e),null}_getWaitingTime(e,t){if(this._transport)return this._transport.getStreamWaitingTimeMs(e,t);throw new Error("transport is not initialized")}_isCallAdmin(){return this._conversation?R$1.includesOneOf(this._conversation.roles,[Ye.ADMIN,Ye.CREATOR]):!1}_checkAdminRole(){if(this._conversation&&!R$1.includesOneOf(this._conversation.roles,[Ye.ADMIN,Ye.CREATOR]))throw new Error("You don't have the required permission")}grantRoles(e,t,i){return c(this,null,function*(){this._checkAdminRole(),yield this._signaling.grantRoles(e,t,i);})}startAsr(e){return c(this,null,function*(){yield this._signaling.startAsr(e);})}stopAsr(){return c(this,null,function*(){yield this._signaling.stopAsr();})}requestAsr(e){return c(this,null,function*(){yield this._signaling.requestAsr(e);})}muteParticipant(){return c(this,arguments,function*(e=null,t,i=[],a=null){this._checkAdminRole(),yield this._signaling.muteParticipant(e,t,i,a);})}enableFeatureForRoles(e,t){return c(this,null,function*(){yield this._signaling.enableFeatureForRoles(e,t);})}pinParticipant(e,t,i=null){return c(this,null,function*(){this._checkAdminRole(),yield this._signaling.pinParticipant(e,t,i),this._conversation.pinnedParticipantIdByRoom.set(i,t?null:e);})}updateMediaModifiers(e){return c(this,null,function*(){this._signaling.ready&&this._conversation&&(this._conversation.mediaModifiers=e,yield this._signaling.updateMediaModifiers(e));})}changeOptions(e){return c(this,null,function*(){if(this._signaling.ready&&this._conversation){this._checkAdminRole(),yield this._signaling.changeOptions(e);let t=jr(this._conversation.options,e);this._onOptionsChanged(t);}})}getWaitingHall(e,t,i){return c(this,null,function*(){if(!this._signaling)return Promise.reject();let a=null;e&&(a=Aa(e));let o=yield this._signaling.getWaitingHall(a,t,i);if(o.error)return Promise.reject(o.message);let s=o.participants||[],p=[],u=[],m=null;return s.length&&(s.forEach(E=>{if(E.externalId){let P=fe.fromSignaling(E.externalId);p.push(P),this._api.cacheExternalId(E.id.id,P);}else u.push(R$1.decomposeId(E.id.id).id);}),u.length&&!p.length&&(p=yield this._api.getExternalIdsByOkIds(u)),o.hasMore&&(m=Ma(s[s.length-1].id))),{participants:p,pageMarker:m,totalCount:o.totalCount||0}})}promoteParticipant(e,t){return c(this,null,function*(){this._signaling&&(yield this._signaling.promoteParticipant(e,t));})}chatMessage(e,t=null){return c(this,null,function*(){this._signaling.ready&&(yield this._signaling.chatMessage(e,t));})}chatHistory(e){return c(this,null,function*(){if(this._signaling.ready){let t=yield this._signaling.chatHistory(e);for(let i=t.messages.length-1;i>=0;i--){let a=t.messages[i];yield this._onChatMessage(a);}}})}customData(e,t=null){return c(this,null,function*(){this._signaling.ready&&(yield this._signaling.customData(e,t));})}createJoinLink(){return c(this,null,function*(){if(this._conversation){let t=(yield this._api.createJoinLink(this._conversation.id)).join_link;if(t)return this._conversation.joinLink=t,t}return Promise.reject()})}removeJoinLink(){return c(this,null,function*(){if(this._conversation&&(yield this._api.removeJoinLink(this._conversation.id)).success){delete this._conversation.joinLink;return}return Promise.reject()})}addMovie(a){return c(this,arguments,function*({movieId:e,gain:t,metadata:i}){let o={movieId:e};(t||t===0)&&(o.gain=t),i&&(o.metadata=i);let s=yield this._signaling.addMovie(o);if(s.error)throw new Error(s.error);return {movieId:s.movieId,streamType:s.streamType}})}updateMovie(e){return c(this,null,function*(){let t=yield this._signaling.updateMovie(e);if(t.error)throw new Error(t.error)})}removeMovie(e){return c(this,null,function*(){let t={movieId:e},i=yield this._signaling.removeMovie(t);if(i.error)throw new Error(i.error)})}updateRooms(e,t){return c(this,null,function*(){let i=yield this._signaling.updateRooms(e,t);if(i.error)throw new Error(i.error)})}activateRooms(e,t){return c(this,null,function*(){let i=yield this._signaling.activateRooms(e,t);if(i.error)throw new Error(i.error)})}switchRoom(e,t){return c(this,null,function*(){let i=yield this._signaling.switchRoom(e,t);if(i.error)throw new Error(i.error)})}removeRooms(e){return c(this,null,function*(){let t=yield this._signaling.removeRooms(e);if(t.error)throw new Error(t.error)})}startStream(e=!1,t=null,i=null,a="DIRECT_LINK",o=null,s=null){return c(this,null,function*(){let p={movieId:i,name:t,privacy:a,groupId:o,roomId:s,streamMovie:!e},u=yield this._signaling.startStream(p);if(u.error)return Promise.reject(u.message)})}stopStream(e=null){return c(this,null,function*(){if((yield this._signaling.stopStream({roomId:e})).error)return Promise.reject()})}recordSetRole(e,t,i=null){return c(this,null,function*(){let a=yield this._signaling.recordSetRole(e,t,i);if(a.error)throw new Error(a.error)})}getStreamInfo(){return c(this,null,function*(){let e=yield this._signaling.getRecordStatus();return {movieId:e.recordMovieId,preview:e.recordMoviePreviewUrl}})}setLocalResolution(i){return c(this,arguments,function*({video:e,effect:t}){var a;if(e.width<l$1.videoMinWidth||e.height<l$1.videoMinHeight)throw new Error("Sizes received are less than the `videoMinWidth` or `videoMinHeight`");if(t){if(t.width<l$1.videoMinWidth||t.height<l$1.videoMinHeight)throw new Error("Sizes of effect received are less than the `videoMinWidth` or `videoMinHeight`");l$1.videoEffectMaxHeight=t.height,l$1.videoEffectMaxWidth=t.width;}return l$1.videoMaxWidth=e.width,l$1.videoMaxHeight=e.height,d.debug("Set local video resolution:",`video ${e.width}x${e.height}`+(t?`, effect ${t.width}x${t.height}`:"")),(a=this._mediaSource)==null?void 0:a.setResolution({video:e,effect:t})})}videoEffect(e){return c(this,null,function*(){var t;return (t=this._mediaSource)==null?void 0:t.videoEffect(e)})}getParticipants(e){return c(this,null,function*(){let t=e.externalIds.map(s=>({id:s.id,type:l$1.externalUserType})),i=yield this._signaling.getParticipants(t);if(i.error)throw new Error(i.error);let a=i.participants,o=this._transport.getState();return Promise.all(a.map(s=>c(this,null,function*(){var u;let p=R$1.composeId(s);return this._createParticipant({id:p,externalId:s.externalId&&ue.fromSignaling(s.externalId,s.deviceIdx||0),mediaSettings:he(s.mediaSettings),participantState:R$1.mapParticipantState(s),state:s.state,roles:s.roles||[],status:(u=this._getStatusByTransportState(o))!=null?u:"WAITING",muteStates:s.muteStates||{},unmuteOptions:s.unmuteOptions||[],observedIds:s.observedIds||[],markers:this._denormalizeMarkers(p,s.markers)})}))).then(R$1.mapSharedParticipants)})}getParticipantListChunk(e){return c(this,null,function*(){var p;d.log("Request participant list chunk",e);let t=yield this._signaling.getParticipantListChunk(e);if(t.error)throw new Error(t.error);let i=this._createParticipantListChunk(t.chunk),a=i.participants.filter(u=>{let m=R$1.composeId(u);return !this._participants[m]});yield this._registerParticipants(a);let o=(p=this._transport)==null?void 0:p.getState();return i.participants.forEach(u=>{var P,k;let m=R$1.composeId(u),E=this._participants[m];E.status=(P=this._getStatusByTransportState(o))!=null?P:"WAITING",E.movieShareInfos=u.movieShareInfos,Object.assign(E.mediaSettings,he(u.mediaSettings)),Object.assign(E.muteStates,u.muteStates),E.unmuteOptions=(k=u.unmuteOptions)!=null?k:E.unmuteOptions,this._openTransport([E],!0);}),this._participantListChunkToExternalChunk(i)})}_getInitialParticiapntListChunk(){return c(this,null,function*(){let e=l$1.participantListChunkInitIndex,t=l$1.participantListChunkInitCount,i="GRID",a=yield this._signaling.getParticipantListChunk({listType:i,fromIdx:e,count:t});return d.debug("Get initial participant list chunk",a.chunk),a.chunk})}_onLocalMediaStreamChanged(e){return c(this,null,function*(){var t,i;this._conversation&&(d.debug("Local media stream changed",e.mediaSettings),g$1.onLocalStreamUpdate(e.mediaSettings,e.kind),this._signaling.ready&&!((t=this._conversation)!=null&&t.waitingHall)&&!((i=this._conversation)!=null&&i.observer)&&(yield this._signaling.changeMediaSettings(e.mediaSettings)));})}_onScreenSharingStatus(e){return c(this,null,function*(){var t,i;if(d.log("Screen sharing changed",e.track,e.mediaSettings),l$1.consumerScreenTrack){let a=e.track?new MediaStream([e.track]):null;g$1.onScreenStream(a,e.mediaSettings),this._signaling.ready&&!((t=this._conversation)!=null&&t.waitingHall)&&!((i=this._conversation)!=null&&i.observer)&&(yield this._signaling.changeMediaSettings(e.mediaSettings));}})}_changeRemoteMediaSettings(e,t){d.debug(`Remote media settings changed [${e}]`,t);let{externalId:i}=this._conversation;if(this._isMe(e)){g$1.onLocalMediaSettings(i,t);return}let o=this._participants[e];if(!o){this._warnParticipantNotInConversation(e);return}o.mediaSettings=t,this._state==="ACTIVE"&&g$1.onRemoteMediaSettings(o.externalId,t,o.markers),this._specListener&&this._specListener.onChangeRemoteMediaSettings(e,t);}_changeRemoteParticipantState(e,t){d.debug(`Remote participant state changed [${e}]`,t);let i=this._participants[e];if(!i){this._warnParticipantNotInConversation(e);return}i.participantState=t||{},this._state==="ACTIVE"&&g$1.onRemoteParticipantState(i.externalId,i.participantState,i.markers);}_invokeRolesChangedCallbackIfNeeded(e){this._state==="ACTIVE"&&e.roles&&e.roles.length&&(d.debug(`Roles for participant [${e.id}] changed: ${e.roles}`),g$1.onRolesChanged(e.externalId,e.roles));}_onSignalingNotification(e){switch(e.notification){case w$1.ACCEPTED_CALL:return this._onAcceptedCall(e);case w$1.HUNGUP:return this._onHungup(e);case w$1.PARTICIPANT_ADDED:return this._onAddedParticipant(e);case w$1.PARTICIPANT_JOINED:return this._onJoinedParticipant(e);case w$1.CLOSED_CONVERSATION:return this._onClosedConversation(e);case w$1.MEDIA_SETTINGS_CHANGED:return this._onMediaSettingsChanged(e);case w$1.PARTICIPANT_STATE_CHANGED:return this._onParticipantStateChanged(e);case w$1.RATE_CALL_DATA:return this._onNeedRate();case w$1.FEATURE_SET_CHANGED:return this._onFeatureSetChanged(e);case w$1.MULTIPARTY_CHAT_CREATED:return this._onMultipartyChatCreated(e);case w$1.FORCE_MEDIA_SETTINGS_CHANGE:return this._onForceMediaSettingsChange(e);case w$1.SETTINGS_UPDATE:return this._onSettingsUpdate(e);case w$1.VIDEO_QUALITY_UPDATE:return this._onVideoQualityUpdate(e);case w$1.REGISTERED_PEER:return this._onPeerRegistered(e);case w$1.SWITCH_MICRO:return this._onMicSwitched(e);case w$1.CHAT_MESSAGE:return this._onChatMessage(e);case w$1.CUSTOM_DATA:return this._onCustomData(e);case w$1.RECORD_STARTED:return this._onRecordInfo(e.recordInfo,e.roomId);case w$1.RECORD_STOPPED:return this._onRecordInfo(null,e.roomId);case w$1.ROLES_CHANGED:return this._onRolesChanged(e.participantId,e.roles||[]);case w$1.MUTE_PARTICIPANT:return this._onMuteParticipant(e);case w$1.PIN_PARTICIPANT:return this._onPinParticipant(e.participantId,e.unpin,e.markers,e.roomId);case w$1.OPTIONS_CHANGED:return this._onOptionsChanged(e.options||[]);case w$1.PARTICIPANT_SOURCES_UPDATE:return this._onParticipantSourcesUpdate(e.participantUpdateInfos);case w$1.PROMOTE_PARTICIPANT:return this._onParticipantPromoted(e);case w$1.CHAT_ROOM_UPDATED:return this._onChatRoomUpdated(e.eventType,e.totalCount,e.firstParticipants);case w$1.JOIN_LINK_CHANGED:return this._onJoinLinkChanged(e);case w$1.FEEDBACK:return this._onFeedback(e);case w$1.MOVIE_UPDATE_NOTIFICATION:return this._onSharedMovieUpdate(e);case w$1.MOVIE_SHARE_STARTED:return this._onSharedMovieInfoStarted(e);case w$1.MOVIE_SHARE_STOPPED:return this._onSharedMovieInfoStopped(e);case w$1.ROOMS_UPDATED:return this._onRoomsUpdated(e);case w$1.ROOM_UPDATED:return this._onRoomUpdated(e);case w$1.ROOM_PARTICIPANTS_UPDATED:return this._onRoomParticipantsUpdated(e);case w$1.FEATURES_PER_ROLE_CHANGED:return this._onFeaturesPerRoleChanged(e);case w$1.PARTICIPANT_ANIMOJI_CHANGED:return this._onParticipantAnimojiChanged(e);case w$1.ASR_STARTED:return this._onAsrInfo(e.asrInfo);case w$1.ASR_STOPPED:return this._onAsrInfo(null)}}_onSignalingReconnect(e){return c(this,null,function*(){if(!this._conversation)return;e.conversation.acceptTime&&(this._conversation.acceptTime=e.conversation.acceptTime),e.conversation.participantsLimit&&(this._conversation.participantsLimit=e.conversation.participantsLimit),e.conversation.features&&(this._conversation.features=e.conversation.features,this._conversation.featuresPerRole=e.conversation.featuresPerRole,this._changeFeatureSet()),this._processPinnedParticipants(e),e.conversation.state;let t=null;if(e.conversation.participants){let i=Object.keys(this._participants),a=[];for(let o of e.conversation.participants){let s=R$1.composeId(o),p=o.roles||[];if(this._isMe(s)){t=he(o.mediaSettings),$t(this._conversation.roles,p)||this._onRolesChanged(s,p);continue}a.push(s);let u=this._participants[s];if(!u)yield this._onJoinedParticipant({participantId:o.id,participant:o,mediaSettings:o.mediaSettings});else {let m=he(o.mediaSettings);ua(m,u.mediaSettings)||this._changeRemoteMediaSettings(s,m);let E=R$1.mapParticipantState(o),P=u.participantState;R$1.isEqualParticipantState(E,P)||this._changeRemoteParticipantState(s,E),$t(p,u.roles)||this._onRolesChanged(u.id,p);}}for(let o of i)a.indexOf(o)<0&&this._removeParticipant(this._participants[o],O$1.HUNGUP);}this._onMuteParticipant({muteStates:e.conversation.muteStates,unmuteOptions:e.unmuteOptions,mediaOptions:[]},t),this._processRecordInfos(e),this._onOptionsChanged(e.conversation.options);})}_onSignalingFailed(e){d.error("Signaling failed",e),this._close(e);}_onAcceptedCall(e){return c(this,null,function*(){let t=R$1.composeMessageId(e),i=R$1.getPeerIdString(e.peerId);if(d.debug(`Participant accepted call [${t}]`),this._statFirstMediaReceived.markAcceptedCall(this._conversation.topology),this._conversation&&this._isMe(t)){this._close(new F$1(O$1.MISSED),"Call accepted on other device");return}let a=this._participants[t];a||(a=this._registerParticipantInCache(yield this._createParticipant({id:t,mediaSettings:he(e.mediaSettings)}))),a.state=W$1.ACCEPTED,a.mediaSettings=he(e.mediaSettings),this._logWithMediaSettings(S$1.ACCEPTED_OUTGOING,a.mediaSettings),this._conversation&&this._conversation.direction===Je.OUTGOING&&(this._state==="IDLE"||this._state==="PROCESSING")&&(this._state="ACTIVE",this._changeFeatureSet()),this._state==="ACTIVE"&&this._transport&&this._transport.open([a.id],i),this._changeRemoteMediaSettings(t,a.mediaSettings),this._changeRemoteParticipantState(t);})}_onHungup(e){return c(this,null,function*(){d.debug(`Participant hungup [${e.participantId}]`,{reason:e.reason});let t=R$1.composeMessageId(e);if(this._conversation&&this._isMe(t)){this._close(new F$1(e.reason,{remote:!0}));return}yield this._registerParticipantAndSetMarkersIfChunkEnabled(t,e.markers);let i=this._participants[t];if(!i){this._warnParticipantNotInConversation(t);return}this._transport&&this._transport.close(t),i.state=e.reason===O$1.REJECTED?W$1.REJECTED:W$1.HUNGUP,this._state!=="CLOSE"&&this._removeParticipant(i,O$1.HUNGUP);})}_onAddedParticipant(e){return c(this,null,function*(){var a,o;d.debug(`Participant added [${e.participantId}]`);let t=R$1.composeMessageId(e),i=this._participants[t];if(i&&i.state!==W$1.HUNGUP&&i.state!==W$1.REJECTED){d.debug(`Participant [${t}] is already in conversation and is active`);return}i||(i=this._registerParticipantInCache(yield this._createParticipant({id:t,externalId:e.participant.externalId&&ue.fromSignaling(e.participant.externalId,e.participant.deviceIdx||0),mediaSettings:he(e.participant.mediaSettings),state:e.participant.state,participantState:R$1.mapParticipantState(e.participant),roles:e.participant.roles||[],muteStates:e.participant.muteStates||{},unmuteOptions:e.participant.unmuteOptions||[],observedIds:e.participant.observedIds||[]}))),i.state=W$1.CALLED,i.mediaSettings=he((a=e.participant)==null?void 0:a.mediaSettings),i.participantState=R$1.mapParticipantState(e.participant),i.roles=((o=e.participant)==null?void 0:o.roles)||[],this._setParticipantsStatus([i],"WAITING"),this._state!=="IDLE"&&this._transport&&this._transport.allocate(i.id,!0),g$1.onParticipantAdded(i.externalId,i.markers),this._changeRemoteMediaSettings(t,i.mediaSettings),this._changeRemoteParticipantState(t,i.participantState),this._invokeRolesChangedCallbackIfNeeded(i);})}_onJoinedParticipant(e){return c(this,null,function*(){var a,o;d.debug(`Participant joined [${e.participantId}]`);let t=R$1.composeMessageId(e),i=this._participants[t];if(i&&i.state===W$1.ACCEPTED){d.warn(`Participant [${t}] is already in conversation and is active`);return}i||(i=this._registerParticipantInCache(yield this._createParticipant({id:t,externalId:e.participant.externalId&&ue.fromSignaling(e.participant.externalId,e.participant.deviceIdx||0),mediaSettings:he(e.participant.mediaSettings),state:e.participant.state,participantState:R$1.mapParticipantState(e.participant),roles:e.participant.roles||[],muteStates:e.participant.muteStates||{},movieShareInfos:e.participant.movieShareInfos,unmuteOptions:e.participant.unmuteOptions||[],observedIds:e.participant.observedIds||[],markers:this._denormalizeMarkers(t,e.participant.markers)}))),this._conversation&&this._conversation.direction===Je.OUTGOING&&(this._state==="IDLE"||this._state==="PROCESSING")&&(this._state="ACTIVE",this._changeFeatureSet()),i.state=W$1.ACCEPTED,i.mediaSettings=he(e.mediaSettings),i.participantState=R$1.mapParticipantState(e.participant),i.roles=e.participant.roles||[],(a=this._transport)!=null&&a.isAllocated(i.id)?this._setParticipantsStatus([i],"CONNECTED"):this._setParticipantsStatus([i],"WAITING"),this._state!=="IDLE"&&this._transport&&(this._transport.isAllocated(i.id)||this._transport.allocate(i.id,!0),this._transport.open([i.id],null,!!((o=this._conversation)!=null&&o.observer))),g$1.onParticipantJoined(i.externalId,i.markers),this._changeRemoteMediaSettings(t,i.mediaSettings),this._changeRemoteParticipantState(t,i.participantState),this._invokeRolesChangedCallbackIfNeeded(i),g$1.onMuteStates(i.muteStates,i.unmuteOptions,Object.keys(i.muteStates),!1,!1,i.externalId,void 0,!0),yield this._processSharedMovieInfos(i.movieShareInfos);})}_onClosedConversation(e){this._toggleJoinAvailability(),this._close(new F$1(e.reason,{remote:!0}));}_onMediaSettingsChanged(e){return c(this,null,function*(){let t=R$1.composeMessageId(e);yield this._registerParticipantAndSetMarkersIfChunkEnabled(t,e.markers),this._changeRemoteMediaSettings(t,he(e.mediaSettings));})}_onParticipantStateChanged(e){return c(this,null,function*(){let t=R$1.composeMessageId(e);yield this._registerParticipantAndSetMarkersIfChunkEnabled(t,e.markers),this._changeRemoteParticipantState(t,R$1.mapParticipantState(e));})}_onNeedRate(){this._conversation&&(this._conversation.needRate=!0,this._changeNeedRate());}_onFeatureSetChanged(e){this._conversation&&(this._conversation.features=e.features,this._conversation.featuresPerRole=e.featuresPerRole,this._changeFeatureSet());}_onMultipartyChatCreated(e){this._conversation&&(this._conversation.chatId=e.chatId,this._toggleJoinAvailability(),g$1.onMultipartyChatCreated(this._conversation));}_onForceMediaSettingsChange(e){return c(this,null,function*(){if(!this._mediaSource)return;let t=this._mediaSource.getMediaSettings(),i=he(e.mediaSettings);t.isAudioEnabled!==i.isAudioEnabled&&(yield this._mediaSource.toggleAudio(i.isAudioEnabled)),t.isVideoEnabled!==i.isVideoEnabled&&(yield this._mediaSource.toggleVideo(i.isVideoEnabled)),l$1.consumerScreenTrack&&t.isScreenSharingEnabled!==i.isScreenSharingEnabled&&(yield this._mediaSource.toggleScreenCapturing({captureScreen:i.isScreenSharingEnabled,fastScreenSharing:i.isFastScreenSharingEnabled,captureAudio:i.isAudioSharingEnabled}));})}_onSettingsUpdate(e){d.debug("Got settings update notification",e);let t={camera:e.camera,screenSharing:e.screenSharing};this._serverSettings=Rr(this._serverSettings,t),this._transport&&this._transport.updateSettings(this._serverSettings);}_onVideoQualityUpdate(e){d.debug("Got video quality update notification",e);let t=Math.round(e.quality.maxBitrate/1024),i=e.quality.maxDimension,a={camera:Object.assign({},this._serverSettings.camera,{maxBitrateK:t,maxDimension:i}),screenSharing:null};this._serverSettings=Rr(this._serverSettings,a),this._transport&&this._transport.updateSettings(this._serverSettings);}_onPeerRegistered(e){let t=R$1.composeMessageId(e);this._participants[t]&&(this._participants[t].clientType=e.clientType,this._participants[t].platform=e.platform);}_onMicSwitched(e){return c(this,null,function*(){g$1.onDeviceSwitched(de.AUDIO,!e.mute),yield this.toggleLocalAudio(!e.mute);})}_onChatMessage(e){return c(this,null,function*(){let t=R$1.composeMessageId(e),i;this._participants[t]?i=this._participants[t].externalId:i=yield this._getParticipantId(t),g$1.onChatMessage(e.message,i,e.direct);})}_onCustomData(e){return c(this,null,function*(){if(e.data.hasOwnProperty("sdk"))return;let t=R$1.composeMessageId(e),i;this._participants[t]?i=this._participants[t].externalId:i=yield this._getParticipantId(t),g$1.onCustomData(e.data,i,e.direct);})}_onRecordInfo(e,t=null){return c(this,null,function*(){if(!this._conversation)return;let i=this._conversation.recordsInfoByRoom.get(t),a=!1;if(!i!=!e?a=!0:i&&e&&(a=i.recordMovieId!==e.recordMovieId),a)if(this._conversation.recordsInfoByRoom.set(t,e),e){let o=yield this._getParticipantId(e.initiator);g$1.onRecordStarted(o,e.recordMovieId,e.recordStartTime,e.recordType,e.recordExternalMovieId,e.recordExternalOwnerId,t);}else g$1.onRecordStopped(t);e&&this._forceOpenTransportForAloneInCall();})}_changePinnedParticipantForRoom(){return c(this,null,function*(){if(!this._conversation)return;let e=this._conversation.roomId,t=this._conversation.pinnedParticipantIdByRoom.get(e);if(t&&!this._isMe(t)){let i=yield this._getExternalIdByParticipantId(t);i&&g$1.onPinnedParticipant(i,!1,null,e);}})}_changeRecordInfoForRoom(){return c(this,null,function*(){if(!this._conversation)return;let e=this._conversation.roomId,t=this._conversation.recordsInfoByRoom.get(e);if(t){let i=yield this._getParticipantId(t.initiator);g$1.onRecordStarted(i,t.recordMovieId,t.recordStartTime,t.recordType,t.recordExternalMovieId,t.recordExternalOwnerId,e);}else g$1.onRecordStopped(e);})}_onParticipantAnimojiChanged(e){return c(this,null,function*(){if(this._conversation){let t=yield this._getParticipantId(e.participantId);g$1.onParticipantVmojiUpdate(t);}})}_onAsrInfo(e){return c(this,null,function*(){if(!this._conversation)return;let t=!1;if(!this._conversation.asrInfo!=!e?t=!0:this._conversation.asrInfo&&e&&(t=this._conversation.asrInfo.movieId!==e.movieId),t)if(e){let i=yield this._getParticipantId(e.initiatorId);g$1.onAsrStarted(i,e.movieId),this._forceOpenTransportForAloneInCall();}else g$1.onAsrStopped();this._conversation.asrInfo=e;})}_onAsrTranscription(e){return c(this,null,function*(){if(!this._conversation)return;let t=yield this._getParticipantId(e.participantId);g$1.onAsrTranscription(t,e.text,e.timestamp,e.duration);})}_onRolesChanged(e,t){if(this._conversation&&this._isMe(e)&&!$t(this._conversation.roles,t)){d.debug(`Local roles changed: ${t}`),this._conversation.roles=t,g$1.onLocalRolesChanged(t),this._processMuteState({mediaOptions:Nt(this._getMuteStatesForCurrentRoom(),xe.MUTE_PERMANENT),stateUpdated:!0}),R$1.includesOneOf(t,[Ye.ADMIN,Ye.CREATOR])&&this._refreshRooms(!0);return}let i=this._participants[e];i&&!$t(i.roles,t)&&(d.debug(`Roles for participant [${e}] changed: ${t}`),i.roles=t,g$1.onRolesChanged(i.externalId,t));}_onMuteParticipant(e,t=null){return c(this,null,function*(){var m;if(!this._conversation)return;let i=(m=e.roomId)!=null?m:null,a=e.muteStates||{},o=e.unmuteOptions||[],s=e.mediaOptions||[],p=e.adminId?this._participants[e.adminId]:null;if(e.participantId&&!this._isMe(e.participantId)){if(!this._isCallAdmin()){d.warn(`Not admin got mute states for participant [${e.participantId}]`);return}let E=this._participants[e.participantId];E&&(d.debug(`Mute states for participant [${e.participantId}] changed`,a),g$1.onMuteStates(a,o,s,e.muteAll,e.unmute,E.externalId,p==null?void 0:p.externalId,e.stateUpdated,e.requestedMedia,e.roomId));return}let u=this._getMuteStatesForRoomId(i);if(!(R$1.isObjectsEquals(u,a)&&R$1.isArraysEquals(this._conversation.unmuteOptions,o)&&!s.length)){if(this._setMuteStatesForRoomId(a,i),this._conversation.unmuteOptions=o,this._isMe(e.adminId)){e.muteAll&&g$1.onMuteStates(a,o,s,e.muteAll,e.unmute,null,this._conversation.externalId,e.stateUpdated,e.requestedMedia,e.roomId);return}yield this._processMuteState({mediaOptions:s,muteAll:e.muteAll,unmute:e.unmute,serverSettings:t,admin:p,stateUpdated:e.stateUpdated,requestedMedia:e.requestedMedia,roomId:e.roomId});}})}_changeMuteStatesForRoom(e,t){if(!this._conversation)return;this._conversation.unmuteOptions=[];let i=this._getMuteStatesForRoomId(t),a=this._getMuteStatesForRoomId(e),o=Object.keys(i),s=Object.keys(a);this._processMuteState({mediaOptions:Array.from(new Set([...o,...s])),roomId:e,muteAll:!0,stateUpdated:!0});}_processMuteState(m){return c(this,arguments,function*({mediaOptions:e=[],muteAll:t=!1,unmute:i=!1,serverSettings:a=null,admin:o=null,stateUpdated:s,requestedMedia:p,roomId:u=null}){if(!this._conversation||!this._mediaSource||this._participantState!==W$1.ACCEPTED)return;let E=Object.assign({},this._getMuteStatesForRoomId(u)),P=this._conversation.unmuteOptions,k=this._mediaSource.getMediaSettings(),D=Object.entries(E);for(let[q,j]of D)if(!(j!==xe.MUTE&&j!==xe.MUTE_PERMANENT)&&(this._isCallAdmin()&&j===xe.MUTE_PERMANENT&&!t&&(E[q]=xe.MUTE),!(!e.includes(q)||i)))switch(q){case de.VIDEO:k.isVideoEnabled&&!(a!=null&&a.isVideoEnabled)&&(g$1.onDeviceSwitched(de.VIDEO,!1),yield this.toggleLocalVideo(!1));break;case de.AUDIO:k.isAudioEnabled&&!(a!=null&&a.isAudioEnabled)&&(g$1.onDeviceSwitched(de.AUDIO,!1),yield this.toggleLocalAudio(!1));break;case de.SCREEN_SHARING:k.isScreenSharingEnabled&&!(a!=null&&a.isScreenSharingEnabled)&&(g$1.onDeviceSwitched(de.SCREEN_SHARING,!1),yield this.disableScreenCapturing());break;case de.AUDIO_SHARING:k.isAudioSharingEnabled&&!(a!=null&&a.isAudioSharingEnabled)&&(g$1.onDeviceSwitched(de.AUDIO_SHARING,!1),yield this.toggleScreenCapturing({captureScreen:k.isScreenSharingEnabled,fastScreenSharing:k.isFastScreenSharingEnabled,captureAudio:!1}));break}g$1.onMuteStates(E,P,e,t,i,null,o==null?void 0:o.externalId,s,p,u);})}_onPinParticipant(e,t=!1,i,a=null){return c(this,null,function*(){if(!this._conversation)return;let o=this._conversation.pinnedParticipantIdByRoom.get(a);if(o&&o!==e)if(this._isMe(o))g$1.onLocalPin(!0,a);else {let s=yield this._getExternalIdByParticipantId(o);s&&g$1.onPinnedParticipant(s,!0,this._denormalizeMarkers(e,i),a);}if(this._isMe(e))g$1.onLocalPin(t,a);else {let s=yield this._getExternalIdByParticipantId(e);s&&g$1.onPinnedParticipant(s,t,this._denormalizeMarkers(e,i),a);}this._conversation.pinnedParticipantIdByRoom.set(a,t?null:e);})}_onOptionsChanged(e){this._conversation&&!Vr(this._conversation.options,e)&&(this._conversation.options=e,g$1.onOptionsChanged(e));}_onNetworkStatus(e){if(this._conversation){let t=[];for(let[i,a]of Object.entries(e)){let o;if(this._isMe(i)||i==="")o=this._conversation.networkRating;else if(this._participants[i])o=this._participants[i].networkRating;else continue;if(o!==a)if(this._isMe(i)||i==="")this._conversation.networkRating=a,g$1.onLocalNetworkStatusChanged(a);else {let s=this._participants[i];s.networkRating=a,t.push({uid:s.externalId,rating:a});}}if(t.length===0)return;d.log("Received network status update: ",e),g$1.onNetworkStatusChanged(t);}}_onRemoteStreamSecond(e,t){let i=this._participants[e];if(i){if(l$1.producerScreenTrack){g$1.onRemoteScreenStream(i.externalId,t);return}if(i.secondStream=t,l$1.videoTracksCount>0){let a=e;if(!this._streamIdByStreamDescription.has(a)){d.error("Received remote stream notification for a participant that has no track associated with it",a);return}let o=this._streamIdByStreamDescription.get(a);if(!o||this._streamWaitTimerByStreamDescription.has(a)){d.log("Delaying secondary stream start/stop until main stream becomes available",a);return}let s=this._streamByStreamId.get(o);if(!s){v$1.log(S$1.PAT_ERROR,"streamNotFound"),d.error(`Could not find stream by ID: ${o}`);return}g$1.onRemoteStream(i.externalId,i.secondStream||s);}else {let a=t||i.remoteStream;a&&g$1.onRemoteStream(i.externalId,a);}}}_onAnimojiStream(e,t){if(this._isMe(e)){g$1.onVmojiStream(t,this._mediaSource.getMediaSettings());return}let i=this._participants[e];i&&g$1.onRemoteVmojiStream(i.externalId,t);}_onPeerConnectionClosed(e){e==="SERVER"&&this._cleanupParticipantAgnosticStreams();}_changeFeatureSet(){if(this._conversation){let e=this._state==="ACTIVE",t=this._conversation.features.includes(qi.ADD_PARTICIPANT);g$1.onCallState(e,t,this._conversation);}}_changeNeedRate(){this._conversation&&this._conversation.needRate&&g$1.onRateNeeded();}_onVolumesDetected(e){let t=[];for(let[i,a]of Object.entries(e)){let o=this._participants[i];o&&o.externalId&&t.push({uid:o.externalId,volume:a.real});}g$1.onVolumesDetected(t);}_onSpeakerChanged(e){this._activeSpeakerId=e,this._participants[e]&&this._lastSignalledActiveSpeakerId!==e&&(g$1.onSpeakerChanged(this._participants[e].externalId),this._lastSignalledActiveSpeakerId=e);}_onTransportStateChanged(e,t){return c(this,null,function*(){d.debug(`Transport state has changed: ${t}`,e);let i=this._getStatusByTransportState(t);if(!i)return;let a=e.reduce((o,s)=>{if(s in this._participants){let p=this._participants[s];o.push(p),t==="CONNECTED"&&(p.remoteStream||(p.mediaSettings&&this._changeRemoteMediaSettings(s,p.mediaSettings),this._changeRemoteParticipantState(s,p.participantState)),this._updateDisplayLayoutFromCache(s));}else this._warnParticipantNotInConversation(s);return o},[]);a.length&&this._setParticipantsStatus(a,i);})}_onTransportLocalStateChanged(e){return c(this,null,function*(){var t;if(d.debug(`Local transport state has changed: ${e}`),e==="CONNECTED"&&(g$1.onLocalStatus("CONNECTED"),((t=this._transport)==null?void 0:t.getTopology())==="SERVER")){let i=Object.values(this._myLastRequestedLayouts);yield this.updateDisplayLayout(i);}e==="CONNECTING"&&g$1.onLocalStatus("CONNECTING"),e==="RECONNECTING"&&g$1.onLocalStatus("RECONNECT"),e==="FAILED"&&this._transport&&this._transport.allocated().length===0&&(this._signaling.ready&&(yield this._signaling.hangup(O$1.FAILED)),this._close(new F$1(O$1.FAILED),"Transport failed"));})}_onRemoteTrackAdded(e,t,i){return c(this,null,function*(){if(e.endsWith(Le.AUDIO_MIX))d.debug("Remote audio mix track added"),this._audioOutput.add(i),g$1.onRemoteMixedAudioStream(t);else if(e.startsWith(Le.PARTICIPANT_AGNOSTIC_TRACK_PREFIX))d.debug(`Participant-agnostic track added: ${e}`),this._streamByStreamId.set(e,t);else {d.debug(`Remote track added on the participant [${e}]`,{kind:i.kind});let a=this._participants[e];if(a||(d.warn(`Conversation: track added before participant [${e}]`),a=this._registerParticipantInCache(yield this._createParticipant({id:e})),this._setParticipantsStatus([a],"WAITING"),this._activeSpeakerId===e&&this._lastSignalledActiveSpeakerId!==e&&(g$1.onSpeakerChanged(a.externalId),this._lastSignalledActiveSpeakerId=e)),this._transport&&!this._transport.isAllocated(a.id)&&this._transport.allocate(a.id,!1),i.kind==="audio"&&(this._audioOutput.add(i),l$1.preserveAudioTracks||t.removeTrack(i)),a.remoteStream!==t){if(a.remoteStream=t,a.secondStream)return;g$1.onRemoteStream(a.externalId,t);}a.mediaSettings&&this._changeRemoteMediaSettings(e,a.mediaSettings),l$1.batchParticipantsOnStart||this._changeRemoteParticipantState(e,a.participantState);}})}_onRemoteTrackRemoved(e,t,i){switch(d.debug(`[${e}] remote track (removed)`,{track:i}),i.kind){case"audio":this._removeAudioTrack(e,t,i);break;case"video":case"screen":this._removeVideoTrack(e,t,i);break}}_removeAudioTrack(e,t,i){if(e!==Le.AUDIO_MIX){let a=this._participants[e];if(!a||a.remoteStream&&a.remoteStream!==t)return}this._audioOutput.remove(i);}_removeVideoTrack(e,t,i){}_onTopologyChanged(e){e==="DIRECT"&&(this._onRemoteSignalledStall([]),this._onRemoteAllStall(!1)),this._conversation&&(this._conversation.topology=e,this._changeFeatureSet());}_onRemoteAllStall(e){if(this._remoteAllStalled===e)return;this._remoteAllStalled=e;let t=[],i=[];for(let a in this._participants)if(this._participants.hasOwnProperty(a)){let o=this._participants[a];e||this._lastStalled[a]?t.push(o):i.push(o);}t.length&&this._setParticipantsStatus(t,"RECONNECT"),i.length&&this._setParticipantsStatus(i,"CONNECTED");}_onRemoteSignalledStall(e){let t={},i=[],a=[];e.forEach(o=>{if(t[o]=!0,!this._lastStalled[o]){let s=this._participants[o];s&&!this._remoteAllStalled&&i.push(s);}delete this._lastStalled[o];}),Object.keys(this._lastStalled).forEach(o=>{let s=this._participants[o];s&&!this._remoteAllStalled&&a.push(s);}),i.length&&this._setParticipantsStatus(i,"RECONNECT"),a.length&&this._setParticipantsStatus(a,"CONNECTED"),this._lastStalled=t;}_onRemoteDataStats(e){this._debugInfo&&this._debugInfo.onRemoteDataStats(e,this._participants),this._fixAudioDevice(e.outbound.rtps);}_fixAudioDevice(e){var t;!b$1.hasMicrophone()||!this._audioFix||!((t=this._mediaSource)!=null&&t.getMediaSettings().isAudioEnabled)||this._audioFix.fix(e);}_toggleJoinAvailability(){let e=this._conversation&&this._conversation.chatId,t=e&&this._state!=="CLOSE"||!1;e&&(d.debug("Toggle join availability",{available:t,chatId:e}),g$1.onJoinStatus(t,e));}_updateDisplayLayoutFromCache(e){return c(this,null,function*(){var i;if(((i=this._transport)==null?void 0:i.getTopology())!=="SERVER")return;let t=this._participants[e];t&&t.lastRequestedLayouts&&Object.keys(t.lastRequestedLayouts).length&&(yield this.updateDisplayLayout(Object.values(t.lastRequestedLayouts)));})}_setParticipantsStatus(e,t,i=null){if(!e.length)return;let a=e.reduce((o,s)=>(s.status!==t&&(s.status=t,l$1.batchParticipantsOnStart?o.push(s.externalId):g$1.onParticipantStatus(s.externalId,t,i)),o),[]);a.length&&l$1.batchParticipantsOnStart&&g$1.onRemoteStatus(a,t,i);}_onJoinLinkChanged(e){g$1.onJoinLinkChanged(e.joinLink);}_onRoomsUpdated(e){return c(this,null,function*(){var i,a;let t={};for(let o of Object.keys(Kt)){let s=e.updates[o];s&&(t[o]={rooms:yield Promise.all(((a=(i=s==null?void 0:s.rooms)==null?void 0:i.map)==null?void 0:a.call(i,this._convertRoomToExternal.bind(this)))||[]),roomIds:s==null?void 0:s.roomIds,deactivated:s==null?void 0:s.deactivated});}g$1.onRoomsUpdated(t);})}_onRoomUpdated(e){return c(this,null,function*(){let t=yield this._convertRoomToExternal(e.room);e.events.some(i=>i===Kt.UPDATE)&&(e.muteStates!==void 0&&this._setMuteStatesForRoomId(e.muteStates,e.roomId),e.recordInfo!==void 0&&this._conversation.recordsInfoByRoom.set(e.roomId,e.recordInfo)),g$1.onRoomUpdated(e.events,e.roomId,t,e.deactivate);})}_convertRoomToExternal(e){return c(this,null,function*(){var s,p,u,m,E,P;if(!e)return null;let[t,i,a,o]=yield Promise.all([Promise.all(((p=(s=e==null?void 0:e.participantIds)==null?void 0:s.map)==null?void 0:p.call(s,this._getExternalIdByParticipantId.bind(this)))||[]),Promise.all(((m=(u=e==null?void 0:e.addParticipantIds)==null?void 0:u.map)==null?void 0:m.call(u,this._getExternalIdByParticipantId.bind(this)))||[]),Promise.all(((P=(E=e==null?void 0:e.removeParticipantIds)==null?void 0:E.map)==null?void 0:P.call(E,this._getExternalIdByParticipantId.bind(this)))||[]),e!=null&&e.pinnedParticipantId?this._getExternalIdByParticipantId(e==null?void 0:e.pinnedParticipantId):null]);return {id:e.id,name:e.name,participantCount:e.participantCount,participantIds:t,addParticipantIds:i,removeParticipantIds:a,participants:e.participants,active:e.active,muteStates:e.muteStates,pinnedParticipantId:o}})}_onRoomParticipantsUpdated(e){return c(this,null,function*(){var E,P,k,D,q;let t=this._transport.getState(),i=(E=e.roomId)!=null?E:null,[a,o]=yield Promise.all([Promise.all(((k=(P=e.addedParticipantIds)==null?void 0:P.map)==null?void 0:k.call(P,this._getExternalIdByParticipantId.bind(this)))||[]),Promise.all(((q=(D=e==null?void 0:e.addedParticipants)==null?void 0:D.map)==null?void 0:q.call(D,j=>c(this,null,function*(){var re;let Y=R$1.composeId(j);return this._createParticipant({id:Y,externalId:j.externalId&&ue.fromSignaling(j.externalId,j.deviceIdx||0),mediaSettings:he(j.mediaSettings),participantState:R$1.mapParticipantState(j),state:j.state,roles:j.roles||[],status:(re=this._getStatusByTransportState(t))!=null?re:"WAITING",muteStates:j.muteStates||{},unmuteOptions:j.unmuteOptions||[],observedIds:j.observedIds||[],markers:this._denormalizeMarkers(Y,j.markers)})})))||[])]),s=!1;for(let j of o)j.id===this._conversation.compositeUserId&&(s=!0),this._registerParticipantInCache(j);this._openTransport(o,!0);let p=[],u=[];if(e!=null&&e.removedParticipantMarkers){for(let j of e.removedParticipantMarkers)j.GRID&&u.push(this._getExternalIdByParticipantId(j.GRID.id));p=yield Promise.all(u);}s&&(yield this._onRoomSwitched(i));let m={roomId:i,participantCount:e.participantCount,addedParticipantIds:a,addedParticipants:R$1.mapSharedParticipants(o),removedParticipantMarkers:e==null?void 0:e.removedParticipantMarkers,removedParticipantIds:p};g$1.onRoomParticipantsUpdated(m);})}_onRoomSwitched(e,t=!1){return c(this,null,function*(){if(!this._conversation||this._conversation.roomId===e)return;let i=this._conversation.roomId;if(this._conversation.roomId=e,t){g$1.onRoomStart(e);return}g$1.onRoomSwitched(e),e!==null&&!this._isCallAdmin()&&(yield this._refreshRooms(!1)),this._changePinnedParticipantForRoom(),this._changeRecordInfoForRoom(),this._changeMuteStatesForRoom(e,i);})}_refreshRooms(e){return c(this,null,function*(){var a,o;let i=(o=(a=(yield this._signaling.getRooms(e)).rooms)==null?void 0:a.rooms)!=null?o:[];for(let s of i)this._setMuteStatesForRoomId(s.muteStates,s.id),this._conversation.recordsInfoByRoom.set(s.id,s.recordInfo),this._conversation.pinnedParticipantIdByRoom.set(s.id,s.pinnedParticipantId);e&&g$1.onRoomsUpdated({[Kt.UPDATE]:{rooms:yield Promise.all(i.map(this._convertRoomToExternal.bind(this)))}});})}_onFeedback(e){return c(this,null,function*(){let t=o=>c(this,null,function*(){return (yield this._registerParticipantAndSetMarkersIfChunkEnabled(o)).externalId}),i=e.feedback.map(o=>c(this,null,function*(){let s=o.items.map(u=>c(this,null,function*(){if(u.participantId===this._conversation.compositeUserId)return Promise.resolve(ze(Re({},u),{participantId:this._conversation.externalId}));let m=yield t(u.participantId);return ze(Re({},u),{participantId:m})})),p=yield Promise.all(s);return ze(Re({},o),{items:p})})),a=yield Promise.all(i);g$1.onFeedback(a,e.roomId);})}_isMe(e){var t;return e===((t=this._conversation)==null?void 0:t.compositeUserId)}_getMuteStatesForRoomId(e=null){var i;return (i=this._conversation.muteStates.get(e))!=null?i:{}}_getMuteStatesForCurrentRoom(){return this._getMuteStatesForRoomId(this._conversation.roomId)}_setMuteStatesForRoomId(e={},t=null){this._conversation.muteStates.set(t,e);}_forceOpenTransportForAloneInCall(){var e;this._transport.getTopology()==="SERVER"&&this._transport.getState()==="IDLE"&&this._participantState!==W$1.CALLED&&this._transport.open(this._transport.allocated(),null,!!((e=this._conversation)!=null&&e.observer),!0);}},N$1=G$1;N$1._delayedHangup=!1;var oi=class extends Error{constructor(e,t){super(e);Object.setPrototypeOf(this,oi.prototype),this.participantErrors=t;}};var jt,si=null;function io(){return c(this,null,function*(){var n;if(l$1.apiEnv!=="AUTO")return l$1.apiEndpoint;try{let r=atob("aHR0cHM6Ly9kbnMuZ29vZ2xlL3Jlc29sdmU/bmFtZT12aWRlby5fZW5kcG9pbnQub2sucnUmdHlwZT1UWFQ="),t=yield (yield fetch(r,{method:"GET",mode:"cors",cache:"no-cache"})).json(),i=(n=t==null?void 0:t.Answer[0])==null?void 0:n.data;if(!i)throw new Error("Wrong DNS response");return d.debug("Resolved API endpoint",i),i}catch(r){return d.warn("Failed to resolve API endpoint using DNS, default is used",r),l$1.apiEndpoint}})}function La(){return c(this,null,function*(){return jt||si||(si=io(),jt=yield si,si=null,jt)})}function Na(){if(!l$1.apiKey)throw new F$1(ie.API,{message:"Required argument apiAppKey not passed"})}function Pr(t){return c(this,arguments,function*(n,r={},e=!1){if(!window.Blob||!window.navigator.sendBeacon)return;yield La();let i=Ba(n,r,e),a=new window.Blob([i],{type:"application/x-www-form-urlencoded"});window.navigator.sendBeacon(`${jt}/fb.do`,a);})}function Ua(t){return c(this,arguments,function*(n,r={},e=!1){yield La();let i=Ba(n,r,e);return ro(i)})}function ro(n){return c(this,null,function*(){return new Promise((r,e)=>{let t=new XMLHttpRequest;t.open("POST",`${jt}/fb.do`,!0),t.setRequestHeader("Content-type","application/x-www-form-urlencoded"),t.onreadystatechange=()=>{if(t.readyState!==XMLHttpRequest.DONE)return;let i;try{i=JSON.parse(t.responseText);}catch(a){i={result:t.responseText};}t.status!==200||i.hasOwnProperty("error_msg")?e(i):r(i);},t.send(n);})})}function Ba(n,r={},e=!1){r.method=n,r.format="JSON",r.application_key||(r.application_key=l$1.apiKey),e||(ae.sessionKey?r.session_key=ae.sessionKey:ae.accessToken&&(r.access_token=ae.accessToken));for(let[i,a]of Object.entries(r))typeof a=="object"&&(r[i]=JSON.stringify(a));let t="";for(let[i,a]of Object.entries(r))t&&(t+="&"),t+=`${i}=${encodeURIComponent(a)}`;return t}var no=10,oo=700,so=3e3,ci=class extends Rt{constructor(){super(...arguments);this._userId=null;this._externalUidsCache=new Map;this._extrnalUidsBatch=new Set;this._extrnalUidsBatchTimeout=null;}_callUnsafe(a){return c(this,arguments,function*(e,t={},i=!1){let o=s=>c(this,null,function*(){try{return yield Ua(e,t,i)}catch(p){if(!p.hasOwnProperty("error_msg")&&(s++,d.debug(`${e} network error, attempt ${s}...`),s<no))return yield R$1.delay(Math.min(s*oo,so)),o(s);throw d.warn(e,"error",p),p}});return o(0)})}_call(a){return c(this,arguments,function*(e,t={},i=!1){try{return yield this._callUnsafe(e,t,i)}catch(o){d.warn("Api call error",o);let s=ie.API;switch(o.error_code){case 102:case 103:case 104:return yield this.authorize(),this._callUnsafe(e,t,i);case 1101:s=O$1.SERVICE_DISABLED;break;case 300:s=O$1.NOT_FOUND;break;case 1102:s=O$1.CALLEE_IS_OFFLINE;break;case 1103:s=O$1.NOT_FRIENDS;break;case 1104:case 1106:s=O$1.EXTERNAL_API_ERROR;break;case 1113:s=O$1.CALLER_IS_REJECTED;break}throw new F$1(s,{message:o.error_msg,code:o.error_code})}})}userId(e){return c(this,null,function*(){let t=R$1.decomposeId(e).id;return ae.isEmpty()?fe.fromId(String(t)):(yield this._prepareUserIdsByOkIdsBatched([t]),fe.fromString(this._externalUidsCache.get(t)))})}prepareUserIds(e){return c(this,null,function*(){ae.isEmpty()||(yield this._prepareUserIdsByOkIdsBatched(e));})}_prepareUserIdsByOkIdsBatched(e){return e.some(i=>!this._externalUidsCache.has(i))?(e.forEach(i=>this._extrnalUidsBatch.add(i)),this._extrnalUidsBatchTimeout||(this._extrnalUidsBatchPromise=new Promise(i=>{this._extrnalUidsBatchTimeout=window.setTimeout(()=>{if(this._extrnalUidsBatch.size>0){let a=[...this._extrnalUidsBatch];this._extrnalUidsBatch.clear(),this._getExternalIdsByOkIds(a).then(o=>{for(let s in o)o.hasOwnProperty(s)&&this._externalUidsCache.set(parseInt(s,10),o[s]);i();});}this._extrnalUidsBatchTimeout=null;},l$1.api.userIdsByOkBatchedTimeout);})),this._extrnalUidsBatchPromise):Promise.resolve()}authorize(){return c(this,null,function*(){if(!this._uuid){let t=Qe.get("uuid");t||(t=R$1.uuid(),Qe.set("uuid",t)),this._uuid=String(t);}let e={session_data:{version:2,device_id:this._uuid,client_version:l$1.appVersion,client_type:"SDK_JS"}};return l$1.authToken&&(e.session_data.auth_token=l$1.authToken,e.session_data.version=3),this._callUnsafe("auth.anonymLogin",e,!0).then(t=>{t.uid&&(this._userId=Number(t.uid)),ae.sessionKey=t.session_key,ae.sessionSecretKey=t.session_secret_key;}).catch(t=>{throw t.error_code===401&&g$1.onTokenExpired(),new F$1(ie.AUTH,{message:t.error_msg,code:t.error_code})})})}log(e){let t={collector:"ok.mobile.apps.video",data:JSON.stringify({application:`${l$1.appName}:${l$1.sdkVersion}`,platform:l$1.platform,items:e})};Pr("log.externalLog",t);}init(){Na();}joinConversation(e,t=!1,i){return c(this,null,function*(){let a={conversationId:e,isVideo:t,protocolVersion:l$1.protocolVersion};return i&&(a.chatId=i),this._call("vchat.joinConversation",a)})}createConversation(o){return c(this,arguments,function*(e,t="",i=!1,{onlyAdminCanShareMovie:a}={}){let s=this._preareStartConversationData({conversationId:e,isVideo:!1,joiningAllowed:!0,payload:t,requireAuthToJoin:i,onlyAdminCanShareMovie:a});return this._startConversation(s)})}startConversation(m,E,P){return c(this,arguments,function*(e,t,i,a=!1,o="",s=!1,p=!1,{onlyAdminCanShareMovie:u}={}){let k=this._preareStartConversationData({conversationId:e,isVideo:a,joiningAllowed:s,payload:o,requireAuthToJoin:p,onlyAdminCanShareMovie:u});if(t&&t.length)switch(i){case Ke.USER:k.uids=t.join(",");break;case Ke.GROUP:k.gid=t[0];break;case Ke.CHAT:k.chatId=t[0];break}return this._startConversation(k)})}_preareStartConversationData({conversationId:e,isVideo:t,payload:i="",joiningAllowed:a=!1,requireAuthToJoin:o=!1,onlyAdminCanShareMovie:s}){let p={conversationId:e,isVideo:t,protocolVersion:l$1.protocolVersion};return a&&(p.createJoinLink=!0),i&&(p.payload=i),l$1.domain&&(p.domainId=l$1.domain),l$1.externalDomain&&(p.externalDomain=l$1.externalDomain),o&&(p.requireAuthToJoin=!0),s!==void 0&&(p.onlyAdminCanShareMovie=s),p}_startConversation(e){return c(this,null,function*(){return this._call("vchat.startConversation",e)})}createJoinLink(e){return c(this,null,function*(){return this._call("vchat.createJoinLink",{conversationId:e})})}removeJoinLink(e){return c(this,null,function*(){return this._call("vchat.removeJoinLink",{conversationId:e})})}getAnonymTokenByLink(e,t){return c(this,null,function*(){let i={joinLink:e};t&&(i.anonymName=t);let a=yield this._call("vchat.getAnonymTokenByLink",i);return this._userId=Number(a.uid),a.token})}joinConversationByLink(e,t=!1,i,a){return c(this,null,function*(){let o={joinLink:e,isVideo:t,protocolVersion:l$1.protocolVersion};return i!=null&&i.length&&(o.observedIds=i.join(",")),l$1.anonymToken&&(o.anonymToken=l$1.anonymToken),a&&(o.payload=a),this._call("vchat.joinConversationByLink",o)})}getOkIdsByExternalIds(e){return c(this,null,function*(){let t=fe.fromIds(e),i=[],a={methods:[]},o=[],s=[...this._externalUidsCache.keys()],p=[...this._externalUidsCache.values()];for(let m of t){let E=fe.toString(m),P=p.indexOf(E);P>-1?i.push(Number(s[P])):(o.push(E),a.methods.push({"vchat.getOkIdByExternalId":{params:{externalId:m.id,anonym:m.type==="ANONYM"},onError:"SKIP"}}));}return a.methods.length&&(yield this._call("batch.executeV2",a)).forEach((m,E)=>{if(m.ok){let P=Number(m.ok.ok_id);this._externalUidsCache.set(P,o[E]),i.push(P);}}),i})}getExternalIdsByOkIds(e){return c(this,null,function*(){let t=[],i=[];for(let o of e)this._externalUidsCache.has(o)?t.push(fe.fromString(this._externalUidsCache.get(o))):i.push(o);if(!i.length)return t;let a=yield this._getExternalIdsByOkIds(i);for(let o in a)a.hasOwnProperty(o)&&this._externalUidsCache.set(parseInt(o,10),a[o]);for(let o of i)a.hasOwnProperty(o)&&t.push(fe.fromString(a[o]));return t})}getCachedOkIdByExternalId(e){let t=[...this._externalUidsCache.keys()],i=[...this._externalUidsCache.values()],a=fe.toString(e),o=i.indexOf(a);return o>-1?R$1.composeUserId(t[o],z$1.USER):null}cacheExternalId(e,t){let i=R$1.decomposeId(e).id;this._externalUidsCache.set(i,fe.toString(t));}getConversationParams(e){return c(this,null,function*(){let t={};return l$1.anonymToken&&(t.anonymToken=l$1.anonymToken),e&&(t.conversationId=e),this._call("vchat.getConversationParams",t)})}getUserId(){return this._userId}setUserId(e){this._userId=e;}hangupConversation(e){let t={conversationId:e,reason:O$1.HUNGUP};l$1.anonymToken&&(t.anonymToken=l$1.anonymToken),Pr("vchat.hangupConversation",t);}removeHistoryRecords(e){return c(this,null,function*(){yield this._call("vchat.removeHistoryRecords",{recordIds:e.join(",")});})}cleanup(){}_getExternalIdsByOkIds(e){return c(this,null,function*(){let t={};try{let i=yield this._call("vchat.getExternalIdsByOkIds",{uids:e.join(",")});if(i.external_ids)for(let[a,o]of Object.entries(i.external_ids))t[a]=fe.fromIdToString(o,"USER");if(i.anonym_ids)for(let[a,o]of Object.entries(i.anonym_ids))t[a]=fe.fromIdToString(o,"ANONYM");return t}catch(i){return t}})}};var Ui=class{requestAsr(r){let e=new ArrayBuffer(2),t=new DataView(e);return t.setUint8(0,1),t.setUint8(1,r?0:1),e}};var Fa=(U=>(U.RECOVER="recover",U.ACCEPT_CALL="accept-call",U.ADD_PARTICIPANT="add-participant",U.REMOVE_PARTICIPANT="remove-participant",U.HANGUP="hangup",U.TRANSMIT_DATA="transmit-data",U.ACCEPT_PRODUCER="accept-producer",U.ALLOCATE_CONSUMER="allocate-consumer",U.CHANGE_MEDIA_SETTINGS="change-media-settings",U.CHANGE_PARTICIPANT_STATE="change-participant-state",U.CHANGE_STREAM_PRIORITIES="change-streams-priorities",U.UPDATE_DISPLAY_LAYOUT="update-display-layout",U.REPORT_PERF_STAT="report-perf-stat",U.REPORT_SHARING_STAT="report-sharing-stat",U.RECORD_START="record-start",U.RECORD_STOP="record-stop",U.RECORD_SET_ROLE="record-set-role",U.RECORD_GET_STATUS="record-get-status",U.SWITCH_MICRO="switch-micro",U.SWITCH_TOPOLOGY="switch-topology",U.REQUEST_REALLOC="request-realloc",U.CHAT_MESSAGE="chat-message",U.CHAT_HISTORY="chat-history",U.CUSTOM_DATA="custom-data",U.GRANT_ROLES="grant-roles",U.MUTE_PARTICIPANT="mute-participant",U.ENABLE_FEATURE_FOR_ROLES="enable-feature-for-roles",U.PIN_PARTICIPANT="pin-participant",U.UPDATE_MEDIA_MODIFIERS="update-media-modifiers",U.CHANGE_OPTIONS="change-options",U.GET_WAITING_HALL="get-waiting-hall",U.GET_PARTICIPANT_LIST_CHUNK="get-participant-list-chunk",U.GET_PARTICIPANTS="get-participants",U.PROMOTE_PARTICIPANT="promote-participant",U.REQUEST_TEST_MODE="request-test-mode",U.ADD_MOVIE="add-movie",U.UPDATE_MOVIE="update-movie",U.REMOVE_MOVIE="remove-movie",U.GET_ROOMS="get-rooms",U.UPDATE_ROOMS="update-rooms",U.ACTIVATE_ROOMS="activate-rooms",U.REMOVE_ROOMS="remove-rooms",U.SWITCH_ROOM="switch-room",U.FEEDBACK="feedback",U.ASR_START="asr-start",U.ASR_STOP="asr-stop",U.REQUEST_ASR="request-asr",U))(Fa||{}),x$1=Fa;function di(){let n=new DataView(new ArrayBuffer(64)),r=0;function e(t){if(r+t>n.byteLength){let i=new Uint8Array(Math.max(r+t,n.byteLength+64));i.set(new Uint8Array(n.buffer.slice(0,r))),n=new DataView(i.buffer);}}return {put(t){if(e(t.byteLength),co(t)){let i=t.buffer;new Uint8Array(n.buffer).set(new Uint8Array(i),r);}else new Uint8Array(n.buffer).set(new Uint8Array(t),r);r+=t.byteLength;},putI8(t){e(1),n.setInt8(r,t),++r;},putI16(t){e(2),n.setInt16(r,t),r+=2;},putI32(t){e(4),n.setInt32(r,t),r+=4;},putI64(t){e(8);let i=t<0;i&&(t=-t);let a=t/4294967296|0,o=t%4294967296|0;i&&(o=~o+1|0,a=o===0?~a+1|0:~a),n.setUint32(r,a),n.setUint32(r+4,o),r+=8;},putUi8(t){e(1),n.setUint8(r,t),++r;},putUi16(t){e(2),n.setUint16(r,t),r+=2;},putUi32(t){e(4),n.setUint32(r,t),r+=4;},putUi64(t){e(8),n.setUint32(r,t/4294967296|0),n.setUint32(r+4,t%4294967296),r+=8;},putF(t){e(8),n.setFloat64(r,t),r+=8;},ui8array(){return new Uint8Array(n.buffer.slice(0,r))}}}function co(n){return n.buffer!==void 0}function Bi(n){let r=ArrayBuffer.isView(n)?new DataView(n.buffer,n.byteOffset,n.byteLength):new DataView(n),e=0;return {peek(){return r.getUint8(e)},get(t){e+=t;let i=r.byteOffset;return r.buffer.slice(i+e-t,i+e)},getI8(){return r.getInt8(e++)},getI16(){return e+=2,r.getInt16(e-2)},getI32(){return e+=4,r.getInt32(e-4)},getI64(){e+=8;let t=r.getInt32(e-8),i=r.getUint32(e-4);return t*4294967296+i},getUi8(){return r.getUint8(e++)},getUi16(){return e+=2,r.getUint16(e-2)},getUi32(){return e+=4,r.getUint32(e-4)},getUi64(){e+=8;let t=r.getUint32(e-8),i=r.getUint32(e-4);return t*4294967296+i},getF32(){return e+=4,r.getFloat32(e-4)},getF64(){return e+=8,r.getFloat64(e-8)}}}var ja=0,Ha=1,uo=2,mo=0,ho=1,_o=2,Fi=0,go=0,fo=0,So=1,Vi=class{constructor(){this.participantIdRegistry=null;}setParticipantIdRegistry(r){this.participantIdRegistry=r;}serializeUpdateDisplayLayout(r,e){let t=di();Int.enc(t,ja),Int.enc(t,Fi),Int.enc(t,r),Nil.enc(t,null);let i=[];for(let a in e)e.hasOwnProperty(a)&&this.writeLayout(e,a,i);return Arr.enc(t,i),Nil.enc(t,null),t.ui8array()}writeLayout(r,e,t){let i=r[e],a=di();if(this.writeStreamDesc(e,a),Lt(i))Int.enc(a,ho);else if(Ir(i))Int.enc(a,_o);else if(Int.enc(a,mo),i.priority!==void 0?Int.enc(a,i.priority):Nil.enc(a,null),i.width!==void 0&&i.height!==void 0?(Int.enc(a,Math.round(i.width)),Int.enc(a,Math.round(i.height))):(Nil.enc(a,null),Nil.enc(a,null)),i.fit!==void 0)switch(i.fit){case"cv":Int.enc(a,fo);break;case"cn":Int.enc(a,So);break;default:Nil.enc(a,null);}else Nil.enc(a,null);t.push(a.ui8array());}writeStreamDesc(r,e){if(this.participantIdRegistry){let t=this.participantIdRegistry.getCompactId(r);if(t!==void 0){Int.enc(e,t);return}}Str.enc(e,r);}serializePerfStatReport(r,e){let t=di();return Int.enc(t,Ha),Int.enc(t,Fi),Int.enc(t,r),Int.enc(t,e.framesDecoded),Int.enc(t,e.framesReceived),t.ui8array()}serializeSharingStatReport(r,e){let t=di();return Int.enc(t,uo),Int.enc(t,Fi),Int.enc(t,r),Int.enc(t,e.minDelay),Int.enc(t,e.maxDelay),Int.enc(t,e.avgDelay),Int.enc(t,e.largeDelayDuration),t.ui8array()}deserializeCommandResponse(r){return c(this,null,function*(){let e;if(r instanceof Blob){let o=Blob.prototype.arrayBuffer?yield r.arrayBuffer():yield pa(r);e=Bi(o);}else e=Bi(r);let t=Int.dec(e),i=Int.dec(e);if(i!==Fi){d.warn("Unsupported version for command type: "+t+", version "+i);return}if(Int.dec(e)!==go){d.warn("Error code: "+t+"received for command type: "+t+", version "+i);return}switch(t){case ja:return this.deserializeUpdateDisplayLayoutResponse(e);case Ha:return this.deserializeReportPerfStatResponse(e);default:return d.warn("unsupported command response commandType: "+t),null}})}deserializeUpdateDisplayLayoutResponse(r){let e=Int.dec(r),t=Arr.dec(r),i={};return t.forEach(a=>{let o=Bi(a),s=Any.dec(o);if(typeof s=="string")i[s]=Int.dec(o);else {let p=s,u=He(this.participantIdRegistry.getStreamDescription(p));i[u]=Int.dec(o);}}),{type:"response",sequence:e,response:x$1.UPDATE_DISPLAY_LAYOUT.toString(),errorCodeByParticipantId:i}}deserializeReportPerfStatResponse(r){let e=Int.dec(r),t=Int.dec(r);return {type:"response",sequence:e,response:x$1.REPORT_PERF_STAT.toString(),estimatedPerformanceIndex:t}}};var ji="open",Ga=[()=>l$1.producerScreenTrack,()=>l$1.videoTracksCount>0,()=>!0,()=>l$1.filteredMessages,()=>l$1.consumerScreenTrack,()=>!0,()=>l$1.movieShare,()=>l$1.useParticipantListChunk,()=>l$1.useRooms,()=>l$1.useVmoji],vo=10,Eo=["service-unavailable","conversation-ended","invalid-token"],be=class extends Pt{constructor(){super(...arguments);this.socket=null;this.sequence=1;this.lastStamp=0;this.websocketCommandsQueue=[];this.datachannelCommandsQueue=[];this.asrCommandsQueue=[];this.incomingCache=[];this.responseHandlers={};this.reconnectCount=0;this.conversationResolve=null;this.conversationReject=null;this.connected=!1;this.listenersReady=!1;this.postfix="&platform="+l$1.platform+"&appVersion="+l$1.appVersion+"&version="+l$1.protocolVersion+"&device="+l$1.device+"&capabilities="+be._getCapabilityFlags();this.peerId=null;this.conversationId=null;this.reconnectTimer=0;this.connectionMessageWaitTimer=0;this.doctorTimer=0;this.participantIdRegistry=null;this.producerNotificationDataChannel=null;this.producerCommandDataChannel=null;this.asrDataChannel=null;this.producerCommandDataChannelEnabled=!1;this.producerCommandSerializationService=new Vi;this.asrCommandSerializer=new Ui;}static _getCapabilityFlags(){let e=0;for(let t=0;t<Ga.length;t++)Ga[t]()&&(e|=1<<t);return e.toString(16).toUpperCase()}get ready(){return this.socket!==null}setEndpoint(e){this.endpoint=e;}setConversationId(e){this.conversationId=e;}setParticipantIdRegistry(e){this.participantIdRegistry=e,this.producerCommandSerializationService.setParticipantIdRegistry(e);}setProducerNotificationDataChannel(e){this.producerNotificationDataChannel=e,this.producerNotificationDataChannel.onmessage=t=>{var a;let i=(a=this.participantIdRegistry)==null?void 0:a.handleMessage(t.data);i&&this._handleMessage(i);};}setProducerCommandDataChannel(e){this.producerCommandDataChannel=e,this.producerCommandDataChannel.onmessage=t=>{this.producerCommandSerializationService.deserializeCommandResponse(t.data).then(i=>{i&&this._handleMessage(i);}).catch(i=>{d.warn("Cannot parse message at producerCommandDataChannel",i);});},this._handleCommandsQueue(this.datachannelCommandsQueue);}useCommandDataChannel(e){this.producerCommandDataChannelEnabled=e;}cleanup(){this.datachannelCommandsQueue=[];}connect(e){return c(this,null,function*(){return this.postfix+=`&clientType=${l$1.clientType}`,new Promise((t,i)=>{if(this.socket&&this.socket.readyState<WebSocket.CLOSING){v$1.log(S$1.SOCKET_ACTION,"already_opened"),i(Error("Socket already opened"));return}this.conversationResolve=a=>{t(a),this.conversationResolve=null,this.conversationReject=null;},this.conversationReject=a=>{i(a),this.conversationResolve=null,this.conversationReject=null;},this._connect(e);})})}_send(a){return c(this,arguments,function*(e,t={},i=0){if(t.participantId){let o=R$1.decomposeParticipantId(t.participantId),s=R$1.decomposeId(o.compositeUserId);t=Object.assign({},t,{participantId:s.id,participantType:s.type}),o.deviceIdx&&(t.deviceIdx=o.deviceIdx);}return this._sendRaw(e,t,i)})}_sendRaw(a){return c(this,arguments,function*(e,t={},i=0){let o=s=>{var p,u;if(e===x$1.REQUEST_ASR)this.asrCommandsQueue.push(s),((p=this.asrDataChannel)==null?void 0:p.readyState)===ji&&this._handleCommandsQueue(this.asrCommandsQueue);else if(this._isDataChannelCommand(e))this.datachannelCommandsQueue.push(s),((u=this.producerCommandDataChannel)==null?void 0:u.readyState)===ji&&this._handleCommandsQueue(this.datachannelCommandsQueue);else {if(!this.socket){v$1.log(S$1.SOCKET_ACTION,"not_opened"),d.warn("Socket not opened"),s.reject(new Error(`Socket not opened [${e}]`),!0);return}this.socket.readyState>WebSocket.OPEN&&(v$1.log(S$1.SOCKET_ACTION,"invalid_state"),d.warn(`Socket is not opened, state ${this.socket.readyState}`)),this.websocketCommandsQueue.push(s),this.socket&&this.socket.readyState===WebSocket.OPEN&&this._handleCommandsQueue(this.websocketCommandsQueue);}};return new Promise((s,p)=>{let u=(E,P=!1)=>{!i||P?p(E):(d.debug("Resending a signaling message",e,m.sequence),i--,o(m));},m={sequence:this.sequence++,name:e,params:t,responseTimer:0,resolve:s,reject:u};o(m);})})}_isDataChannelCommand(e){return this.producerCommandDataChannelEnabled?e===x$1.UPDATE_DISPLAY_LAYOUT||e===x$1.REPORT_PERF_STAT||e===x$1.REPORT_SHARING_STAT:!1}static _isDataChannelResponseRequired(e){return e===x$1.UPDATE_DISPLAY_LAYOUT||e===x$1.REPORT_PERF_STAT}getNextCommandSequenceNumber(){return this.sequence}hangup(e){return c(this,null,function*(){return this._send(x$1.HANGUP,{reason:e}).catch(()=>{})})}sendCandidate(e,t){return c(this,null,function*(){return this._send(x$1.TRANSMIT_DATA,{participantId:e,data:{candidate:t}})})}requestTestMode(e,t){return c(this,null,function*(){return this._send(x$1.REQUEST_TEST_MODE,{consumer:e,producer:t})})}sendSdp(e,t){return c(this,null,function*(){return this._send(x$1.TRANSMIT_DATA,{participantId:e,data:{sdp:t}})})}acceptCall(e){return c(this,null,function*(){return this._send(x$1.ACCEPT_CALL,{mediaSettings:e})})}changeMediaSettings(e){return c(this,null,function*(){return this._send(x$1.CHANGE_MEDIA_SETTINGS,{mediaSettings:e},vo)})}changeParticipantState(e){return c(this,null,function*(){return this._send(x$1.CHANGE_PARTICIPANT_STATE,{participantState:{state:e}})})}addParticipant(e,t){return c(this,null,function*(){return this._send(x$1.ADD_PARTICIPANT,Re({participantId:e},t))})}removeParticipant(e,t=!1){return c(this,null,function*(){return this._send(x$1.REMOVE_PARTICIPANT,{participantId:e,ban:t})})}allocateConsumer(e,t){return c(this,null,function*(){let i={capabilities:t};return e&&(i.description=e.sdp),this._send(x$1.ALLOCATE_CONSUMER,i)})}acceptProducer(e,t){return c(this,null,function*(){let i={description:e.sdp};return t&&(i.ssrcs=t),this._send(x$1.ACCEPT_PRODUCER,i)})}changePriorities(e){return c(this,null,function*(){return this._send(x$1.CHANGE_STREAM_PRIORITIES,{typedPriorities:e}).catch(()=>{})})}updateDisplayLayout(e){return c(this,null,function*(){return this._send(x$1.UPDATE_DISPLAY_LAYOUT,e)})}addMovie(e){return c(this,null,function*(){return this._send(x$1.ADD_MOVIE,e)})}updateMovie(e){return c(this,null,function*(){return this._send(x$1.UPDATE_MOVIE,e)})}removeMovie(e){return c(this,null,function*(){return this._send(x$1.REMOVE_MOVIE,e)})}updateRooms(e,t){return c(this,null,function*(){return this._send(x$1.UPDATE_ROOMS,{rooms:e,assignRandomly:t})})}activateRooms(e,t){return c(this,null,function*(){return this._send(x$1.ACTIVATE_ROOMS,{roomIds:e,deactivate:t})})}switchRoom(e,t){return c(this,null,function*(){return this._sendRaw(x$1.SWITCH_ROOM,{toRoomId:e,participantId:t})})}getRooms(e){return c(this,null,function*(){return this._sendRaw(x$1.GET_ROOMS,{withParticipants:e})})}removeRooms(e){return c(this,null,function*(){return this._send(x$1.REMOVE_ROOMS,{roomIds:e})})}startStream(e){return c(this,null,function*(){return this._send(x$1.RECORD_START,e)})}stopStream(){return c(this,arguments,function*(e={roomId:null}){return this._send(x$1.RECORD_STOP,e)})}recordSetRole(e,t,i=null){return c(this,null,function*(){return this._send(x$1.RECORD_SET_ROLE,{participantId:e,role:t,roomId:i})})}getRecordStatus(){return c(this,null,function*(){return this._send(x$1.RECORD_GET_STATUS)})}switchTopology(e,t=!1){return c(this,null,function*(){return this._send(x$1.SWITCH_TOPOLOGY,{topology:e,force:t})})}requestRealloc(){return c(this,null,function*(){return this._send(x$1.REQUEST_REALLOC)})}reportPerfStat(e){return c(this,null,function*(){return this._send(x$1.REPORT_PERF_STAT,e)})}reportSharingStat(e){return c(this,null,function*(){return this._send(x$1.REPORT_SHARING_STAT,e)})}chatMessage(e,t=null){return c(this,null,function*(){return this._send(x$1.CHAT_MESSAGE,{message:e,participantId:t})})}chatHistory(e){return c(this,null,function*(){return this._send(x$1.CHAT_HISTORY,{count:e})})}customData(e,t){return c(this,null,function*(){return this._send(x$1.CUSTOM_DATA,{data:e,participantId:t})})}grantRoles(e,t,i){return c(this,null,function*(){let a={participantId:e,roles:t};return i&&(a.revoke=!0),this._sendRaw(x$1.GRANT_ROLES,a)})}muteParticipant(e,t,i,a=null){return c(this,null,function*(){return this._sendRaw(x$1.MUTE_PARTICIPANT,{participantId:e,muteStates:t,requestedMedia:i,roomId:a})})}enableFeatureForRoles(e,t){return c(this,null,function*(){return this._sendRaw(x$1.ENABLE_FEATURE_FOR_ROLES,{feature:e,roles:t})})}pinParticipant(e,t,i){return c(this,null,function*(){let a={participantId:e,roomId:i};return t&&(a.unpin=!0),this._sendRaw(x$1.PIN_PARTICIPANT,a)})}updateMediaModifiers(e){return c(this,null,function*(){return this._send(x$1.UPDATE_MEDIA_MODIFIERS,{mediaModifiers:e})})}changeOptions(e){return c(this,null,function*(){return this._send(x$1.CHANGE_OPTIONS,{options:e})})}getWaitingHall(e=null,t,i=!1){return c(this,null,function*(){let a={};return e&&(a.fromId=e),t&&(a.count=t),i&&(a.backward=i),this._send(x$1.GET_WAITING_HALL,a)})}promoteParticipant(e,t=!1){return c(this,null,function*(){let i={participantId:e};return t&&(i.demote=t),this._sendRaw(x$1.PROMOTE_PARTICIPANT,i)})}feedback(e){return c(this,null,function*(){return this._sendRaw(x$1.FEEDBACK,{key:e})})}close(){this.socket&&this.socket.readyState<WebSocket.CLOSING&&this._closeSocket(),this._stopWaitConnectionMessage(),this._stopDoctor(),clearTimeout(this.reconnectTimer);}readyToSend(){this.listenersReady=!0,this._handleCachedMessages();}getParticipantListChunk(e){return c(this,null,function*(){return this._send(x$1.GET_PARTICIPANT_LIST_CHUNK,e)})}getParticipants(e){return c(this,null,function*(){return this._send(x$1.GET_PARTICIPANTS,{externalIds:e})})}startAsr(e){return c(this,null,function*(){return this._send(x$1.ASR_START,e)})}stopAsr(){return c(this,null,function*(){return this._send(x$1.ASR_STOP)})}requestAsr(e){return c(this,null,function*(){return this._send(x$1.REQUEST_ASR,{request:e})})}setAsrDataChannel(e){this.asrDataChannel=e,this._handleCommandsQueue(this.asrCommandsQueue);}_connect(e){if(this.socket&&this.socket.readyState<WebSocket.CLOSING)return;let t="";e&&(t+=`&tgt=${e}`),e===$e.RETRY&&this.lastStamp&&(t+=`&recoverTs=${this.lastStamp}`),t=i(t),d.debug("Connecting to "+this.endpoint+this.postfix+t),Ve(S$1.SIGNALING_CONNECTED),this.socket=new WebSocket(this.endpoint+this.postfix+t),this.socket.onopen=this._onOpen.bind(this),this.socket.onmessage=this._onMessage.bind(this),this.socket.onerror=this._onError.bind(this),this.socket.onclose=this._onClose.bind(this),this._startDoctor();function i(a){if(!l$1.useParticipantListChunk)return a;let o=l$1.participantListChunkInitIndex;a+=`&partIdx=${o}`;let s=l$1.participantListChunkInitCount;return s!==null&&(a+=`&partCount=${s}`),a}}_disconnect(e){this.socket&&this.socket.readyState<WebSocket.CLOSING&&(this.socket.onopen=null,this.socket.onmessage=null,this.socket.onerror=null,this.socket.onclose=null,this.socket.close(e),this.socket=null),this._stopWaitConnectionMessage(),this._stopDoctor(),clearTimeout(this.reconnectTimer);}_onOpen(){d.debug("Socket opened"),v$1.log(S$1.SOCKET_ACTION,"opened"),ge.logEventualStat({name:S$1.SIGNALING_CONNECTED}),this._waitConnectionMessage(),this._startDoctor();}_onMessage(e){if(this._startDoctor(),e.data==="ping"){this.socket&&this.socket.readyState===WebSocket.OPEN&&this.socket.send("pong");return}try{this._handleMessage(JSON.parse(e.data));}catch(t){v$1.log(S$1.SOCKET_ACTION,"parse_error"),d.error("Unable to parse message",t,e.data);}}_handleMessage(e){var t;switch(e.type){case"notification":e.notification==="connection"?(d.debug("Signaling connected",e),this.connected=!0,this.reconnectCount=0,this.endpoint=e.endpoint,e.peerId&&this.peerId!==e.peerId.id&&(this.postfix+=`&peerId=${e.peerId.id}`,this.peerId=e.peerId.id),this._stopWaitConnectionMessage(),this.conversationResolve?this.conversationResolve(e):(this._triggerEvent(ve.RECONNECT,e),e.conversation.topology&&this._triggerEvent(ve.NOTIFICATION,{type:"notification",notification:w$1.TOPOLOGY_CHANGED,topology:e.conversation.topology})),this.lastStamp&&this._handleCachedMessages(),(t=e.recoverMessages)==null||t.forEach(i=>this._handleMessage(i)),this._handleCommandsQueue(this.websocketCommandsQueue)):!this.connected||!this.listenersReady?this.incomingCache.push(e):this._triggerEvent(ve.NOTIFICATION,e);break;case"response":this._handleCommandResponse(!0,e);break;case"error":this._handleErrorMessage(e);break;default:v$1.log(S$1.SOCKET_ACTION,"unknown_message"),d.warn("Unhandled message",e);}this.lastStamp=e.stamp||this.lastStamp;}_handleErrorMessage(e){var i;v$1.log(S$1.SOCKET_ACTION,`error-${e.error}`);let t=Eo.includes(e.error);switch(this.responseHandlers[e.sequence]&&this._handleCommandResponse(!1,e),e.error){case"service-unavailable":this._reconnect();break;case"conversation-ended":this.conversationReject?this.conversationReject(new F$1(e.reason||ie.SIGNALING_FAILED,{message:`Conversation ended: ${e.error}`,remote:!0})):this._triggerEvent(ve.NOTIFICATION,{notification:w$1.CLOSED_CONVERSATION,reason:e.reason});break;case"invalid-token":this._throwError(new Error(`Signaling error: ${e.error}`));break;default:if(!t)break;this.connected?this._throwError(new Error(`Signaling error: ${e.error}`)):e.sequence||((i=this.conversationReject)==null||i.call(this,new F$1(e.reason||ie.SIGNALING_FAILED,{message:`Unable to connect to the signaling: ${e.error}`,remote:!0})),this._closeSocket());}}_handleCachedMessages(){let e=[...this.incomingCache];for(this.incomingCache=[];e.length>0;){let t=e.shift();this._handleMessage(t);}}_throwError(e){this._triggerEvent(ve.FAILED,e);}_onError(e){v$1.log(S$1.SOCKET_ACTION,"error"),d.error("Signaling error",e);}_onClose(e){v$1.log(S$1.SOCKET_ACTION,"closed"),d.debug("Connection closed",{code:e.code,reason:e.reason}),this.connected=!1,this._stopDoctor(),this.socket&&this.reconnectCount++<be.RECONNECT_MAX_COUNT?this._reconnect():this.socket&&this._closeSocket(new Error("Connection closed"));}_closeSocket(e=null){this.socket&&(this._disconnect(),Object.values(this.responseHandlers).forEach(t=>{window.clearTimeout(t.responseTimer),e&&t.reject(new Error("Connection closed"),!0);}),this.websocketCommandsQueue=[],this.responseHandlers={},this.lastStamp=0,e&&this._throwError(new Error("Connection closed")));}_reconnect(){let e=Math.min(be.RECONNECT_MAX_DELAY,be.RECONNECT_DELAY*Math.pow(2,this.reconnectCount-1));d.log(`Reconnect websocket after ${e}ms (${this.reconnectCount})`),v$1.log(S$1.SOCKET_ACTION,"reconnect"),this.reconnectTimer=window.setTimeout(this._connect.bind(this,$e.RETRY),e);}_handleCommandResponse(e,t){var a;if(!this.responseHandlers.hasOwnProperty(t.sequence))return;let i=this.responseHandlers[t.sequence];window.clearTimeout(i.responseTimer),e?(delete this.responseHandlers[t.sequence],i.resolve(t)):t.type==="error"?(delete this.responseHandlers[t.sequence],v$1.log(S$1.SOCKET_ACTION,"response-error"),i.reject(new Error(t.error||`Response error [${i.name}]`),!0)):((a=this.socket)==null?void 0:a.readyState)===WebSocket.OPEN?(delete this.responseHandlers[t.sequence],v$1.log(S$1.SOCKET_ACTION,"response-timeout"),i.reject(new Error(t.error||`Response timeout [${i.name}]`))):i.responseTimer=window.setTimeout(()=>this._handleCommandResponse(!1,t),be.WAIT_RESPONSE_DELAY);}_serializeAsrCommand(e){let t=e.params;return this.asrCommandSerializer.requestAsr(t.request)}_handleCommandsQueue(e){var t,i,a,o;for(;e.length>0;){let s=e.shift();if(s.name===x$1.REQUEST_ASR){if(((t=this.asrDataChannel)==null?void 0:t.readyState)!==ji){s.reject(new Error(`Invalid data channel state: ${(i=this.asrDataChannel)==null?void 0:i.readyState}`));return}let p=this._serializeAsrCommand(s);p!==null&&(this.asrDataChannel.send(p),s.resolve({}));}else if(this._isDataChannelCommand(s.name)){if(((a=this.producerCommandDataChannel)==null?void 0:a.readyState)!==ji){s.reject(new Error(`Invalid data channel state: ${(o=this.producerCommandDataChannel)==null?void 0:o.readyState}`));return}be._isDataChannelResponseRequired(s.name)&&(s.responseTimer=window.setTimeout(()=>this._handleCommandResponse(!1,{command:s.name,sequence:s.sequence}),be.WAIT_RESPONSE_DELAY),this.responseHandlers[s.sequence]=s);let p=this._serializeBinary(s);p!==null&&this.producerCommandDataChannel.send(p);}else {if(!this.socket||this.socket.readyState!==WebSocket.OPEN){s.reject(new Error("Invalid state or socket already closed"));continue}s.responseTimer=window.setTimeout(()=>this._handleCommandResponse(!1,{command:s.name,sequence:s.sequence}),be.WAIT_RESPONSE_DELAY),this.responseHandlers[s.sequence]=s,this.socket.send(this._serializeJson(s));}}}_serializeBinary(e){switch(e.name){case x$1.UPDATE_DISPLAY_LAYOUT:return this.producerCommandSerializationService.serializeUpdateDisplayLayout(e.sequence,e.params);case x$1.REPORT_PERF_STAT:return this.producerCommandSerializationService.serializePerfStatReport(e.sequence,e.params);case x$1.REPORT_SHARING_STAT:return this.producerCommandSerializationService.serializeSharingStatReport(e.sequence,e.params)}return d.warn("cannot get binary data for data channel command: "+e.name),null}_serializeJson(e){let t;e.name===x$1.UPDATE_DISPLAY_LAYOUT?t=this._convertDisplayLayout(e.params):t=e.params;let i=Object.assign({command:e.name,sequence:e.sequence},t);return JSON.stringify(i)}_convertDisplayLayout(e){let t=e,i={};for(let a in t)t.hasOwnProperty(a)&&(i[a]=Pa(t[a]));return {layouts:i}}_waitConnectionMessage(){this.connectionMessageWaitTimer=window.setTimeout(()=>{this.conversationReject&&this.conversationReject(new F$1(ie.SIGNALING_FAILED,{message:"Unable to connect to the signaling: connection timeout",remote:!0}));},be.WAIT_CONNECTION_DELAY);}_stopWaitConnectionMessage(){window.clearTimeout(this.connectionMessageWaitTimer),this.connectionMessageWaitTimer=0;}_startDoctor(){this._stopDoctor(),this.doctorTimer=window.setTimeout(()=>{d.warn("Socket is dead, trying to reconnect"),this._disconnect(4e3),this._connect($e.RETRY);},be.WAIT_MESSAGE_DELAY);}_stopDoctor(){window.clearTimeout(this.doctorTimer),this.doctorTimer=0;}},Ue=be;Ue.RECONNECT_DELAY=l$1.signalingReconnectDelay,Ue.RECONNECT_MAX_DELAY=l$1.signalingReconnectMaxDelay,Ue.RECONNECT_MAX_COUNT=l$1.signalingReconnectMaxCount,Ue.WAIT_CONNECTION_DELAY=l$1.waitConnectionDelay,Ue.WAIT_RESPONSE_DELAY=l$1.waitResponseDelay,Ue.WAIT_MESSAGE_DELAY=l$1.waitMessageDelay;var Wa=(e=>(e.KING="KING",e.PAWN="PAWN",e))(Wa||{});var Ht,ne,li=null,mg={getCameras:b$1.getCameras,getMicrophones:b$1.getMicrophones,getOutput:b$1.getOutput,getVideoFacingMode:b$1.getVideoFacingMode,hasCamera:b$1.hasCamera,hasMicrophone:b$1.hasMicrophone,getSavedCamera:b$1.getSavedCamera,getSavedMicrophone:b$1.getSavedMicrophone,getSavedOutput:b$1.getSavedOutput,hasCameraPermission:b$1.hasCameraPermission,hasMicrophonePermission:b$1.hasMicrophonePermission,hasPermissions:b$1.hasPermissions,getUserMedia:b$1.getUserMedia,getUserVideo:b$1.getUserVideo,getUserAudio:b$1.getUserAudio,setResolution:b$1.setResolution,isBrowserSupported:b$1.isBrowserSupported,isScreenCapturingSupported:b$1.isScreenCapturingSupported,os:b$1.os,isMobile:b$1.isMobile,browserName:b$1.browserName,browserVersion:b$1.browserVersion,baseChromeVersion:b$1.baseChromeVersion,getAudioContext:b$1.getAudioContext,isAudioShareSupported:b$1.isAudioShareSupported};({participantMarkerCompare:R$1.participantMarkerCompare});function To(n){ne=n;}function Ro(n){Ht=n;}function _g(n){li=n;}function gg(n){l$1.videoEffects=n;}function Sg(n){return c(this,null,function*(){if(l$1.set(n),b$1.browserName()==="Sferum"&&(l$1.platform=`SFERUM:${b$1.browserVersion()}`),ne||To(new ci),Ht||Ro(()=>new Ue),l$1.debug&&(adapter.disableLog(!1),d.toggle(!0)),d.log(`Calls SDK ${l$1.sdkVersion}`,n),yield b$1.init(),!b$1.isBrowserSupported())throw new F$1(ie.UNSUPPORTED);d.log("UserAgent:",navigator.userAgent),d.log("Screen resolution:",`${window.screen.width}x${window.screen.height}`),d.log("Permissions:",`Camera: ${b$1.hasCameraPermission()}, Mic: ${b$1.hasMicrophonePermission()}`),ne.init();})}function Co(s){return c(this,arguments,function*(n,r=Ke.USER,e,t="",i=!1,a=!1,o){if(N$1.current())throw d.error("There is already active call"),new F$1(O$1.FAILED);return new N$1(ne,Ht(),li).onStart(n,r,e,t,i,a,o)})}function Po(t){return c(this,arguments,function*(n,r=z$1.USER,e){if(n===N$1.id())throw new Error("Push has already been processed");return new N$1(ne,Ht(),li).onPush(n,r,e)})}function Tg(){return c(this,arguments,function*(n=[de.AUDIO]){return It().accept(n)})}function Rg(){return c(this,null,function*(){let n=N$1.current();if(n)return n.decline()})}function yo(n,r,e){return c(this,null,function*(){if(N$1.current())throw d.error("There is already active call"),new F$1(O$1.FAILED);return new N$1(ne,Ht(),li).onJoin({conversationId:n,mediaOptions:r,chatId:e})})}function Pg(a){return c(this,arguments,function*(n,r=[de.AUDIO],e,t,i){if(N$1.current())throw d.error("There is already active call"),new F$1(O$1.FAILED);return e&&(l$1.anonymToken=e),new N$1(ne,Ht(),li).onJoin({joinLink:n,mediaOptions:r,observedIds:t,payload:i})})}function yg(){return c(this,null,function*(){let n=N$1.current();if(n)return n.hangup();N$1.hangupAfterInit();})}function Ag(n,r){return c(this,null,function*(){let e=N$1.current();if(n==="videoinput"&&ut.contains(r))return l$1.videoFacingMode=r,e?(b$1.isMobile()&&e.stopVideoTrack(),e.changeDevice(n)):void 0;if(!(yield b$1._saveDeviceId(n,r)))throw new Error(`Device not found: ${r}`);if(e)return e.changeDevice(n)})}function Dg(n){return c(this,null,function*(){let r=typeof n=="object"?ze(Re({},n),{fastScreenSharing:n.captureScreen&&n.fastScreenSharing,captureAudio:n.captureScreen&&n.captureAudio&&l$1.audioShare}):{captureScreen:n,fastScreenSharing:!1,captureAudio:!1},e=N$1.current();return e?e.toggleScreenCapturing(r):Promise.reject()})}function Og(n,r=!1){return c(this,null,function*(){let e=N$1.current();e&&(yield e.setVideoStream(n,r));})}function wg(n){return c(this,null,function*(){let r=N$1.current();r&&(yield r.toggleLocalVideo(n));})}function xg(n){return c(this,null,function*(){let r=N$1.current();r&&(yield r.toggleLocalAudio(n));})}function Lg(n){return c(this,null,function*(){let r=N$1.current();if(r)return r.setLocalResolution(n)})}function Do(a){return c(this,arguments,function*({uid:n=null,muteStates:r,requestedMedia:e=[],deviceIdx:t=0,roomId:i=null}){let o=N$1.current();if(o){let s=n?R$1.composeParticipantId(n,z$1.USER,t):null;yield o.muteParticipant(s,r,e,i);}})}function Hg(n){return c(this,null,function*(){let r=N$1.current();r&&(yield r.updateMediaModifiers(n));})}function qg(){return c(this,arguments,function*(n="",r=!1,{onlyAdminCanShareMovie:e=!1}={}){return (yield ne.createConversation(R$1.uuid(),n,r,{onlyAdminCanShareMovie:e})).join_link})}function zg(){return c(this,null,function*(){let n=N$1.current();return n?n.createJoinLink():Promise.reject()})}function Zg(n=!1,r=null,e=null,t="DIRECT_LINK",i=null,a=null){return c(this,null,function*(){let o=N$1.current();return o?o.startStream(n,r,e,t,i,a):Promise.reject()})}function ef(n=null){return c(this,null,function*(){let r=N$1.current();return r?r.stopStream(n):Promise.reject()})}function rf(){return c(this,null,function*(){let n=N$1.current();return n?n.getStreamInfo():Promise.reject()})}function uf(n){adapter.disableLog(!n),d.toggle(n);}function hf(n){return c(this,null,function*(){let r=N$1.current();if(r)return r.videoEffect(n)})}function It(){let n=N$1.current();if(!n)throw new Error("Conversation not found");return n}

    class Logger extends Ct {
        constructor(statVars) {
            super();
            this.batchInterval = 3000;
            this.statVars = {};
            this.batch = [];
            // Детекция двойных логов првоеряем гипотезу
            this.incomingLogged = false;
            this.log = (name, value, immediately) => {
                if (name === "callAcceptIncoming" /* Stat.ACCEPT_INCOMING */) {
                    if (this.incomingLogged) {
                        const message = `
                Logs incoming duplicates are detected! for \r\n
                ConversationId: ${this.convId}\r\n`;
                        OK.logger.clob('calls', message, 'calls.double.log');
                    }
                    this.incomingLogged = true;
                }
                const data = { name: name };
                if (typeof value !== 'undefined') {
                    data.value = value;
                }
                data.timestamp = Date.now();
                data.videoChatId = this.chatId;
                this.batch.push(data);
                if (immediately || !this.batchTimeout) {
                    this.sendBatch();
                }
            };
            this.setChatId = (chatId) => {
                this.chatId = chatId;
            };
            this.setConvId = (convId) => {
                this.convId = convId;
            };
            this.sendBatch = () => {
                this.stopTimeout();
                if (this.batch.length > 0) {
                    this.send(this.batch);
                    this.batch.length = 0;
                    this.startTimeout();
                }
            };
            this.onUnload = () => {
                this.sendBatch();
                this.stopTimeout();
            };
            if (statVars) {
                this.addStatVars(statVars);
            }
            window.addEventListener('beforeunload', this.onUnload);
            window.addEventListener('unload', this.onUnload);
        }
        /**
         * Логируем сюда
         * https://graylog.service.local.odkl.ru/streams/5bffd9a976ab020040fef9dd/search?q=facility%3A%22odnoklassniki-web%22+AND+message%3A%22calls.runtime.error%22&rangetype=relative&streams=5bffd9a976ab020040fef9dd&relative=300
         */
        error(message) {
            return OK.logger.clob('calls', message, 'calls.runtime.error');
        }
        addStatVars(vars) {
            Object.assign(this.statVars, vars);
        }
        setBatchInterval(value) {
            if (value) {
                this.batchInterval = value;
            }
        }
        destroy() {
            window.removeEventListener('beforeunload', this.onUnload);
            window.removeEventListener('unload', this.onUnload);
        }
        reset() {
            this.incomingLogged = false;
        }
        send(batch) {
            vanillaAjax({
                url: '/dk?cmd=videoStatNew',
                contentType: 'json',
                type: 'POST',
                data: JSON.stringify(Object.assign({}, this.statVars, { batch })),
            });
        }
        startTimeout() {
            this.batchTimeout = window.setTimeout(this.sendBatch, this.batchInterval);
        }
        stopTimeout() {
            if (this.batchTimeout) {
                window.clearTimeout(this.batchTimeout);
                delete this.batchTimeout;
            }
        }
    }

    class ApiAdapter extends Rt {
        constructor(store) {
            super();
            this.store = store;
        }
        init() {
            return Promise.resolve();
        }
        deinit() {
            // @ts-ignore
            delete this._conversationParams;
            // @ts-ignore
            delete this._conversationResponse;
        }
        authorize() {
            return Promise.resolve();
        }
        userId(participantId) {
            const participant = this.store.call.getParticipant(participantId);
            if (!participant) {
                return Promise.resolve({
                    id: this.store.call.getLocalId(participantId),
                    type: Er.USER,
                });
            }
            return Promise.resolve({ id: String(participant.id), type: participant.type });
        }
        getConversationParams() {
            return Promise.resolve(this._conversationParams);
        }
        createConversation(conversationId) {
            return __awaiter(this, void 0, void 0, function* () {
                const payload = {
                    'st.call.conversationId': conversationId,
                    'st.call.ft': 'CALL_VIDEO',
                    'st.call.callDirection': 'OUTGOING',
                    'st.call.cjl': true,
                };
                const conversation = yield this.requestConversation('/web-api/videochat/call', payload);
                return this.setupOKConversation(conversation);
            });
        }
        startConversation(conversationId, ids) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                if (!ids || !ids.length) {
                    return Promise.reject(new Error(`Unable to start conversation ${conversationId}: no IDs specified`));
                }
                const { call, widget } = this.store.get();
                this.store.set({ call: Object.assign(Object.assign({}, call), { conversationId }) });
                const id = ids[0] || 0; // TODO: should set default value
                const payload = {
                    'st.call.ft': call.me.isVideoEnabled ? 'CALL_VIDEO' : 'CALL_AUDIO',
                    'st.call.conversationId': conversationId,
                    'st.call.callDirection': 'OUTGOING',
                    'st.call.opponentType': ((_a = call.opponent) === null || _a === void 0 ? void 0 : _a.type) || Ke.USER,
                };
                let key = 'st.call.opponentId';
                if (((_b = call.opponent) === null || _b === void 0 ? void 0 : _b.type) === Ke.CHAT) {
                    key = 'st.call.chatId';
                    // @ts-ignore
                    delete payload['st.call.opponentType'];
                }
                if (call.userToken) {
                    payload['st.call.userToken'] = call.userToken;
                }
                // XXX Если виджет то не задаем ид с клиента никогда
                if (widget) {
                    // @ts-ignore
                    delete payload['st.call.conversationId'];
                }
                payload[key] = id;
                const conversation = yield this.requestConversation('/web-api/videochat/call', payload);
                this.store.set({ call: Object.assign(Object.assign({}, call), { conversationId: conversation.conversationId }) });
                // XXX Косвенный признак того что диалог уже есть, и стоит попробовать JOIN
                // !NB: Возможно это серверная бага, но мы ей воспользуемся
                if (!conversation.endpoint && conversation.chatId) {
                    return this.joinConversation(conversation.conversationId, !!call.me.isVideoEnabled, conversation.chatId);
                }
                return this.setupOKConversation(conversation);
            });
        }
        joinConversation(conversationId, isVideo, chatId) {
            return __awaiter(this, void 0, void 0, function* () {
                const payload = {
                    'st.call.ft': isVideo ? 'CALL_VIDEO' : 'CALL_AUDIO',
                    'st.call.conversationId': conversationId,
                };
                if (chatId) {
                    payload['st.call.chatId'] = chatId;
                }
                let conversation;
                try {
                    conversation = yield this.requestConversation('/web-api/videochat/join', payload);
                }
                catch (e) {
                    // Создадим новый conversationId и сбросим звонок
                    conversationId = uuid();
                    this.store.call.reset();
                    return this.startConversation(conversationId, [Number(chatId)]);
                }
                return this.setupOKConversation(conversation);
            });
        }
        joinConversationByLink() {
            return __awaiter(this, void 0, void 0, function* () {
                return this._conversationResponse;
            });
        }
        handleErrorStatus(status) {
            if (status instanceof Error) {
                status = O$1.UNKNOWN_ERROR;
            }
            throw new F$1(status);
        }
        getUserId() {
            const { call } = this.store.get();
            // const prefix = call.me.type === ParticipantType.GROUP ? 'g' : 'u';
            // const id = `${prefix}${}`
            return Number(call.me.id);
        }
        // Метод требуется в базовом классе поэтмоу оставим его, но он нам не нужен getUserId работает напрямую со стором
        setUserId(userId) {
            // nothing to do
        }
        /**
         * Tmp implementation, usage of ApiAdapter should be removed in VSRV-8518
         * @param conversationId
         */
        createJoinLink(conversationId) {
            return __awaiter(this, void 0, void 0, function* () {
                const { response } = yield vanillaAjax({
                    url: '/dk',
                    data: { cmd: 'VideoCreateJoinLink', 'st.call.conversationId': conversationId },
                });
                const matches = /data-clipboard-text="([^"]+)"/.exec(response);
                return { join_link: matches ? matches[1] : '' };
            });
        }
        getOkIdsByExternalIds(externalIds) {
            return __awaiter(this, void 0, void 0, function* () {
                const result = [];
                externalIds.forEach((item) => {
                    if (typeof item === 'string') {
                        result.push(Number(item));
                    }
                    else {
                        result.push(Number(item.id));
                    }
                });
                return Promise.resolve(result);
            });
        }
        setupOKConversation(conversation) {
            return __awaiter(this, void 0, void 0, function* () {
                const urls = conversation.endpoint.split('?');
                const endpointParams = new URLSearchParams(urls[1]);
                const params = (yield this.getConversationParams()) || {};
                const conversationResponse = {
                    id: conversation.conversationId,
                    endpoint: params.endpoint || conversation.endpoint,
                    is_concurrent: conversation.concurrent,
                    join_link: conversation.joinLink || this.store.get().call.link,
                };
                if (!params.endpoint && conversation.endpoint) {
                    params.stun_server = conversation.iceServers[0];
                    params.turn_server = conversation.iceServers[1];
                    params.endpoint = urls[0];
                    params.token = endpointParams.get('token');
                    this._conversationParams = params;
                    this._conversationResponse = conversationResponse;
                }
                return conversationResponse;
            });
        }
        requestConversation(url, data) {
            return __awaiter(this, void 0, void 0, function* () {
                let conversation = null;
                try {
                    const { response } = yield vanillaAjax({ url, data, type: 'POST', dataType: 'json' });
                    conversation = response.conversation;
                    if (!conversation) {
                        throw response.status;
                    }
                }
                catch (e) {
                    this.handleErrorStatus(e);
                }
                return conversation;
            });
        }
        // TODO: implement
        getExternalIdsByOkIds(uids) {
            return new Promise((res) => {
                res([
                    {
                        id: 'string',
                        type: Er.USER,
                    },
                ]);
            });
        }
        getCachedOkIdByExternalId(externalId) {
            const prefix = externalId.type === Er.GROUP ? 'g' : 'u';
            return `${prefix}${externalId.id}`;
        }
    }

    const OK_PREFIX = 'OK_CALLS_STORAGE';
    const isAvailable = (function () {
        try {
            return !!localStorage;
        }
        catch (e) {
            return false;
        }
    })();
    function generateKey(key) {
        return `${OK_PREFIX}:${key}`;
    }
    function showWarn() {
        console.warn('[OK calls][storage] is not available');
    }
    const storage = {
        isAvailable,
        set(key, value) {
            if (!isAvailable) {
                showWarn();
                return;
            }
            localStorage.setItem(generateKey(key), JSON.stringify(value));
        },
        get(key) {
            if (!isAvailable) {
                showWarn();
                return;
            }
            const value = localStorage.getItem(generateKey(key));
            try {
                return value && JSON.parse(value);
            }
            catch (e) {
                return value;
            }
        },
        remove(key) {
            if (!isAvailable) {
                showWarn();
                return;
            }
            localStorage.removeItem(generateKey(key));
        },
        clear() {
            if (!isAvailable) {
                showWarn();
                return;
            }
            for (const key in localStorage) {
                if (!key.indexOf(OK_PREFIX)) {
                    localStorage.removeItem(key);
                }
            }
        },
    };
    function storageFactory(defaultSettings, key) {
        return {
            get() {
                return Object.assign(Object.assign({}, defaultSettings), (storage.get(key) || {}));
            },
            set(settings) {
                storage.set(key, settings);
            },
        };
    }

    const VB_STORAGE_KEY = 'vb-settings';
    const effects = {
        WITHOUT: 'without',
        BLUR: 'blur',
        CUSTOM: 'custom',
    };
    const defaultSettings$1 = {
        activeEffect: effects.WITHOUT,
    };
    const vbStorageSettings = storageFactory(defaultSettings$1, VB_STORAGE_KEY);

    /**
     * @vkontakte/calls-video-effects v1.1.4
     * Fri, 31 Mar 2023 11:46:01 GMT
     */
    var e=function(t,r){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t;}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);},e(t,r)};function t(t,r){if("function"!=typeof r&&null!==r)throw new TypeError("Class extends value "+String(r)+" is not a constructor or null");function n(){this.constructor=t;}e(t,r),t.prototype=null===r?Object.create(r):(n.prototype=r.prototype,new n);}function r(e,t,r,n){return new(r||(r=Promise))((function(i,o){function a(e){try{u(n.next(e));}catch(e){o(e);}}function s(e){try{u(n.throw(e));}catch(e){o(e);}}function u(e){var t;e.done?i(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t);}))).then(a,s);}u((n=n.apply(e,t||[])).next());}))}function n(e,t){var r,n,i,o,a={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:s(0),throw:s(1),return:s(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function s(o){return function(s){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;a;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return a.label++,{value:o[1],done:!1};case 5:a.label++,n=o[1],o=[0];continue;case 7:o=a.ops.pop(),a.trys.pop();continue;default:if(!(i=a.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){a=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){a.label=o[1];break}if(6===o[0]&&a.label<i[1]){a.label=i[1],i=o;break}if(i&&a.label<i[2]){a.label=i[2],a.ops.push(o);break}i[2]&&a.ops.pop(),a.trys.pop();continue}o=t.call(e,a);}catch(e){o=[6,e],n=0;}finally{r=i=0;}if(5&o[0])throw o[1];return {value:o[0]?o[1]:void 0,done:!0}}([o,s])}}}var i,o=function(e,t){void 0===t&&(t=[]);var r=t.join(","),n=new Blob(["("+e+")("+r+");"],{type:"application/javascript; charset=utf-8"});return window.URL.createObjectURL(n)};!function(e){e.IE="IE",e.Safari="Safari",e.Chrome="Chrome",e.Edge="Edge",e.Firefox="Firefox",e.Yandex="Yandex",e.Opera="Opera",e.Sferum="Sferum";}(i||(i={}));var l=function(e){return r(void 0,void 0,void 0,(function(){return n(this,(function(t){return [2,new Promise((function(t,r){var n=document.createElement("img");n.crossOrigin="anonymous",n.onerror=function(e){r("Failed image loading: "+e);},n.onload=function(){return t(n)},n.src=e;}))]}))}))},h=function(){function e(){this._backgroundCanvas=document.createElement("canvas");}return e.prototype.resize=function(e,t,r,n){var i,o,a=(void 0===n?{}:n).ctxOptions,s=(o={width:0,height:0},"number"==typeof(i=e).width&&"number"==typeof i.height&&(o.height=i.height,o.width=i.width),o),u=s.height,c=s.width,f=this._backgroundCanvas,l=f.getContext("2d",a);if(!l)throw new Error("ctx did not initialized");f.width=t,f.height=r;var d=Math.max(f.width/c,f.height/u),h=f.width/2-c/2*d,g=f.height/2-u/2*d;return l.drawImage(e,h,g,c*d,u*d),f},e}();var g,m,p,v=(g=function(e,t){var r=function(e){var t,r,n="undefined"!=typeof document&&document.currentScript?document.currentScript.src:void 0,i=void 0!==(e=e||{})?e:{};i.ready=new Promise((function(e,n){t=e,r=n;}));var o,a={};for(o in i)i.hasOwnProperty(o)&&(a[o]=i[o]);var s="./this.program",u=function(e,t){throw t},c="";"undefined"!=typeof document&&document.currentScript&&(c=document.currentScript.src),void 0!==n&&n&&(c=n),c=0!==c.indexOf("blob:")?c.substr(0,c.lastIndexOf("/")+1):"";var f,l=i.print||console.log.bind(console),d=i.printErr||console.warn.bind(console);for(o in a)a.hasOwnProperty(o)&&(i[o]=a[o]);a=null,i.arguments,i.thisProgram&&(s=i.thisProgram),i.quit&&(u=i.quit),i.wasmBinary&&(f=i.wasmBinary);var h,g=i.noExitRuntime||!0;"object"!=typeof WebAssembly&&C("no native wasm support detected");var m,p,v,_,y,w=!1,b="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;function x(e,t,r){for(var n=t+r,i=t;e[i]&&!(i>=n);)++i;if(i-t>16&&e.subarray&&b)return b.decode(e.subarray(t,i));for(var o="";t<i;){var a=e[t++];if(128&a){var s=63&e[t++];if(192!=(224&a)){var u=63&e[t++];if((a=224==(240&a)?(15&a)<<12|s<<6|u:(7&a)<<18|s<<12|u<<6|63&e[t++])<65536)o+=String.fromCharCode(a);else {var c=a-65536;o+=String.fromCharCode(55296|c>>10,56320|1023&c);}}else o+=String.fromCharCode((31&a)<<6|s);}else o+=String.fromCharCode(a);}return o}function E(e){m=e,i.HEAP8=p=new Int8Array(e),i.HEAP16=new Int16Array(e),i.HEAP32=_=new Int32Array(e),i.HEAPU8=v=new Uint8Array(e),i.HEAPU16=new Uint16Array(e),i.HEAPU32=new Uint32Array(e),i.HEAPF32=new Float32Array(e),i.HEAPF64=new Float64Array(e);}i.INITIAL_MEMORY;var T,k,R,A=[],B=[],D=[],F=0,U=null;function C(e){i.onAbort&&i.onAbort(e),d(e+=""),w=!0,e="abort("+e+"). Build with -s ASSERTIONS=1 for more info.";var t=new WebAssembly.RuntimeError(e);throw r(t),t}function S(e){return e.startsWith("data:application/octet-stream;base64,")}function M(e){try{if(e==T&&f)return new Uint8Array(f);throw "both async and sync fetching of the wasm failed"}catch(e){C(e);}}function I(e){for(;e.length>0;){var t=e.shift();if("function"!=typeof t){var r=t.func;"number"==typeof r?void 0===t.arg?y.get(r)():y.get(r)(t.arg):r(void 0===t.arg?null:t.arg);}else t(i);}}function L(e){try{return h.grow(e-m.byteLength+65535>>>16),E(h.buffer),1}catch(e){}}i.preloadedImages={},i.preloadedAudios={},S(T="https://st.mycdn.me/static/callseffects/0-0-3/tflite-simd.wasm")||(k=T,T=i.locateFile?i.locateFile(k,c):c+k),R=function(){return performance.now()};var O={};function P(){if(!P.strings){var e={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:("object"==typeof navigator&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:s||"./this.program"};for(var t in O)void 0===O[t]?delete e[t]:e[t]=O[t];var r=[];for(var t in e)r.push(t+"="+e[t]);P.strings=r;}return P.strings}var W={mappings:{},buffers:[null,[],[]],printChar:function(e,t){var r=W.buffers[e];0===t||10===t?((1===e?l:d)(x(r,0)),r.length=0):r.push(t);},varargs:void 0,get:function(){return W.varargs+=4,_[W.varargs-4>>2]},getStr:function(e){var t=function(e,t){return e?x(v,e,t):""}(e);return t},get64:function(e,t){return e}},G={a:function(){C();},m:function(e,t){var r,n;if(0===e)r=Date.now();else {if(1!==e&&4!==e)return n=28,_[N()>>2]=n,-1;r=R();}return _[t>>2]=r/1e3|0,_[t+4>>2]=r%1e3*1e3*1e3|0,0},i:function(e,t){C("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");},c:function(e,t){C("To use dlopen, you need to use Emscripten's linking support, see https://github.com/emscripten-core/emscripten/wiki/Linking");},g:function(){return 2147483648},k:function(e,t,r){v.copyWithin(e,t,t+r);},l:function(e){var t,r,n=v.length,i=2147483648;if((e>>>=0)>i)return !1;for(var o=1;o<=4;o*=2){var a=n*(1+.2/o);if(a=Math.min(a,e+100663296),L(Math.min(i,((t=Math.max(e,a))%(r=65536)>0&&(t+=r-t%r),t))))return !0}return !1},d:function(e){for(var t=R();R()-t<e;);},e:function(e,t){var r=0;return P().forEach((function(n,i){var o=t+r;_[e+4*i>>2]=o,function(e,t,r){for(var n=0;n<e.length;++n)p[t++>>0]=e.charCodeAt(n);r||(p[t>>0]=0);}(n,o),r+=n.length+1;})),0},f:function(e,t){var r=P();_[e>>2]=r.length;var n=0;return r.forEach((function(e){n+=e.length+1;})),_[t>>2]=n,0},o:function(e){!function(e,t){var r;r=e,g||(i.onExit&&i.onExit(r),w=!0),u(r,new z(r));}(e);},h:function(e){return 0},j:function(e,t,r,n,i){},b:function(e,t,r,n){for(var i=0,o=0;o<r;o++){for(var a=_[t+8*o>>2],s=_[t+(8*o+4)>>2],u=0;u<s;u++)W.printChar(e,v[a+u]);i+=s;}return _[n>>2]=i,0},n:function e(t,r){e.randomDevice||(e.randomDevice=function(){if("object"==typeof crypto&&"function"==typeof crypto.getRandomValues){var e=new Uint8Array(1);return function(){return crypto.getRandomValues(e),e[0]}}return function(){C("randomDevice");}}());for(var n=0;n<r;n++)p[t+n>>0]=e.randomDevice();return 0}};!function(){var e={a:G};function t(e,t){var r,n=e.exports;i.asm=n,E((h=i.asm.p).buffer),y=i.asm.A,r=i.asm.q,B.unshift(r),function(e){if(F--,i.monitorRunDependencies&&i.monitorRunDependencies(F),0==F&&U){var t=U;U=null,t();}}();}function n(e){t(e.instance);}function o(t){return (f||"function"!=typeof fetch?Promise.resolve().then((function(){return M(T)})):fetch(T,{credentials:"same-origin"}).then((function(e){if(!e.ok)throw "failed to load wasm binary file at '"+T+"'";return e.arrayBuffer()})).catch((function(){return M(T)}))).then((function(t){return WebAssembly.instantiate(t,e)})).then((function(e){return e})).then(t,(function(e){d("failed to asynchronously prepare wasm: "+e),C(e);}))}if(F++,i.monitorRunDependencies&&i.monitorRunDependencies(F),i.instantiateWasm)try{return i.instantiateWasm(e,t)}catch(e){return d("Module.instantiateWasm callback failed with error: "+e),!1}(f||"function"!=typeof WebAssembly.instantiateStreaming||S(T)||"function"!=typeof fetch?o(n):fetch(T,{credentials:"same-origin"}).then((function(t){return WebAssembly.instantiateStreaming(t,e).then(n,(function(e){return d("wasm streaming compile failed: "+e),d("falling back to ArrayBuffer instantiation"),o(n)}))}))).catch(r);}(),i.___wasm_call_ctors=function(){return (i.___wasm_call_ctors=i.asm.q).apply(null,arguments)},i._setNumThreads=function(){return (i._setNumThreads=i.asm.r).apply(null,arguments)},i._getModelBufferMemoryOffset=function(){return (i._getModelBufferMemoryOffset=i.asm.s).apply(null,arguments)},i._getInputMemoryOffset=function(){return (i._getInputMemoryOffset=i.asm.t).apply(null,arguments)},i._getOutputMemoryOffset=function(){return (i._getOutputMemoryOffset=i.asm.u).apply(null,arguments)},i._getInputDim=function(){return (i._getInputDim=i.asm.v).apply(null,arguments)},i._getOutputDim=function(){return (i._getOutputDim=i.asm.w).apply(null,arguments)},i._loadModel=function(){return (i._loadModel=i.asm.x).apply(null,arguments)},i._updateRecurrentState=function(){return (i._updateRecurrentState=i.asm.y).apply(null,arguments)},i._runInference=function(){return (i._runInference=i.asm.z).apply(null,arguments)};var j,N=i.___errno_location=function(){return (N=i.___errno_location=i.asm.B).apply(null,arguments)};function z(e){this.name="ExitStatus",this.message="Program terminated with exit("+e+")",this.status=e;}function X(e){function r(){j||(j=!0,i.calledRun=!0,w||(I(B),t(i),i.onRuntimeInitialized&&i.onRuntimeInitialized(),function(){if(i.postRun)for("function"==typeof i.postRun&&(i.postRun=[i.postRun]);i.postRun.length;)e=i.postRun.shift(),D.unshift(e);var e;I(D);}()));}F>0||(function(){if(i.preRun)for("function"==typeof i.preRun&&(i.preRun=[i.preRun]);i.preRun.length;)e=i.preRun.shift(),A.unshift(e);var e;I(A);}(),F>0||(i.setStatus?(i.setStatus("Running..."),setTimeout((function(){setTimeout((function(){i.setStatus("");}),1),r();}),1)):r()));}if(U=function e(){j||X(),j||(U=e);},i.run=X,i.preInit)for("function"==typeof i.preInit&&(i.preInit=[i.preInit]);i.preInit.length>0;)i.preInit.pop()();return X(),e.ready};e.exports=r;},g(m={exports:{}},m.exports),m.exports),_="https://st.mycdn.me/static/callseffects",y=_+"/0-0-3",w=_+"/0-0-5",b=_+"/0-0-6",x=_+"/0-0-8",E=_+"/0-0-9",T=_+"/0-0-12",k=_+"/0-0-13",R={segmentation:{models:{"192x256":y+"/segmentation-model.tflite"},wasm:{tfliteSimd:y+"/tflite-simd.wasm"}},backgrounds:[{id:3012,preview:w+"/3012-preview.png",original:w+"/3012-original.jpg",description:"elephant in the white room",tags:["default"]},{id:3013,preview:w+"/3013-preview.png",original:w+"/3013-original.jpg",description:"old native stove in russian historic house",tags:["default"]},{id:3014,preview:w+"/3014-preview.png",original:w+"/3014-original.jpg",description:"flying baloons surrounded by mountains",tags:["default"]},{id:3015,preview:w+"/3015-preview.png",original:w+"/3015-original.jpg",description:"two pilots driving a plate",tags:["default"]},{id:3016,preview:w+"/3016-preview.png",original:w+"/3016-original.jpg",description:"sauna",tags:["default"]},{id:3017,preview:w+"/3017-preview.png",original:w+"/3017-original.jpg",description:"red chairs in movie theater",tags:["default"]},{id:3018,preview:w+"/3018-preview.png",original:w+"/3018-original.jpg",description:"sleeping person in train cart",tags:["default"]},{id:3019,preview:w+"/3019-preview.jpg",original:w+"/3019-original.jpg",description:"Little Big icons on pink background",tags:["star"]},{id:3020,preview:w+"/3020-preview.jpg",original:w+"/3020-original.jpg",description:"Violet wild mint (2 colors split background)",tags:["star"]},{id:3021,preview:w+"/3021-preview.jpg",original:w+"/3021-original.jpg",description:"Klava Koka left the chat and in love with MDK",tags:["star"]},{id:3022,preview:w+"/3022-preview.jpg",original:w+"/3022-original.jpg",description:"Some half-naked dude with rifle",tags:["star"]},{id:3023,preview:w+"/3023-preview.jpg",original:w+"/3023-original.jpg",description:'"Cirle" photo collage',tags:["star"]},{id:3024,preview:w+"/3024-preview.jpg",original:w+"/3024-original.jpg",description:"Gazgolder & red carpet on the wall",tags:["star"]},{id:3025,preview:w+"/3025-preview.jpg",original:w+"/3025-original.jpg",description:"Gazgolder & VK Clips collab pink-yellow-blue collage",tags:["star"]},{id:3026,preview:w+"/3026-preview.jpg",original:w+"/3026-original.jpg",description:"Crem Soda people collage",tags:["star"]},{id:3027,preview:w+"/3027-preview.jpg",original:w+"/3027-original.jpg",description:"Dmitry Glukhovsky collage",tags:["star"]},{id:3028,preview:b+"/3028-preview.jpeg",original:b+"/3028-original.jpeg",description:"Dogs in space",tags:["cosmonautics-day-2022"]},{id:3029,preview:x+"/3029-preview.jpg",original:x+"/3029-original.jpg",description:"Blackboard with e=mc2 formulas",tags:["teachers-day-2022"]},{id:3030,preview:E+"/3030-preview.jpg",original:E+"/3030-original.jpg",description:"vk 2022 birthday",tags:["vk-2022-birthday"]},{id:3031,preview:T+"/3031-preview.png",original:T+"/3031-original.png",description:"vk 2022 mothers day",tags:["vk-2022-mothers-day"]},{id:3032,preview:k+"/3032-preview.png",original:k+"/3032-original.png",description:"vk 2022 new year",tags:["default"]},{id:3033,preview:k+"/3033-preview.png",original:k+"/3033-original.png",description:"vk 2023 lovers day",tags:["vk-2023-lovers-day"]}],icons:{starBackground:{id:"icon-star-background",description:"Icon for indicating that virtual background is from stars",url:w+"/icon-star-background.svg",type:"svg"}}},A=function(){function e(){}return e.workerFn=function(e){console.log("here goes the worker...");var t=null,r=!1,n={"192x256":[192,256]},i={processSizeKey:"192x256",inputMemoryOffset:0,outputMemoryOffset:0,maskArray:null,numThreads:2},o={log:function(){u.call(null,"log",Array.from(arguments));},warn:function(){u.call(null,"warn",Array.from(arguments));}};function a(a,u,c){return void 0===u&&(u={}),void 0===c&&(c=!1),r=c,o.log("[createModel]",a,u,{debugFlag:c}),e().then((function(e){return function(e,t){return o.log("[loadModel][modelPath]",e,t),fetch(t).then((function(e){return e.arrayBuffer()})).then((function(t){o.log("Model buffer size:",t.byteLength);var r=i.numThreads,n=e._getModelBufferMemoryOffset();return o.log("Model buffer memory offset:",n),o.log("Loading model buffer..."),e.HEAPU8.set(new Uint8Array(t),n),o.log("_loadModel result:",e._loadModel(t.byteLength,r)),{inputMemoryOffset:e._getInputMemoryOffset(0)/4,outputMemoryOffset:e._getOutputMemoryOffset(0)/4}}))}(e,a).then((function(r){return t=e,r}))})).then((function(e){var t=u.processSizeKey||i.processSizeKey,r=n[t],o=r[0],a=r[1],c=new Float32Array(o*a);s(Object.assign({maskArray:c},e,u));})).catch((function(e){t=null,o.warn("simd error",e),self.postMessage({type:"error",error:e});}))}function s(e){Object.assign(i,e),o.log("settings updated",i);}function u(e,t){if(void 0===e&&(e="log"),"function"==typeof console[e]&&r){var n=["[segmentation-worker]"].concat(t);console[e].apply(null,n);}}self.onmessage=function(e){try{switch(e.data.type){case"create":a(e.data.modelPath,e.data.settings,e.data.debug).then((function(){self.postMessage({type:"ready"});}));break;case"frame":var r=function(e){var r=i.maskArray,a=i.inputMemoryOffset,s=i.outputMemoryOffset,u=n[i.processSizeKey],c=u[0],f=u[1];if(t){if(r){for(var l=0,d=0;l<c*f;l++,d+=4)t.HEAPF32[a+d]=e.data[d]/255,t.HEAPF32[a+d+1]=e.data[d+1]/255,t.HEAPF32[a+d+2]=e.data[d+2]/255,t.HEAPF32[a+d+3]=r[l];t._runInference(),t._updateRecurrentState(1,1);var h=new ImageData(f,c);for(l=0,d=0;l<c*f;l++,d+=4)r[l]=t.HEAPF32[s+l],h.data[d+3]=255*r[l];return h}o.warn("no maskArray created");}else o.warn("no tfliteSIMD instance!");}(e.data.imageData);r&&self.postMessage({type:"frame",segmentationMask:r,resizedImage:e.data.imageData},[r.data.buffer,e.data.imageData.data.buffer]);break;case"params":s(e.data.params);break;default:o.warn("unhandled event",e.data);}}catch(e){o.warn("onmessage error",e),self.postMessage({type:"error",error:e});}};},e}(),B=function(){function e(e){var t=this,r=e.onFrame,n=e.onReady,i=e.onError;this._settings={modelKey:"192x256",processSizeKey:"192x256"},this._processSize={"192x256":[192,256]},this._worker=null,this._worker=new Worker(o(A.workerFn,[v,JSON.stringify({})])),this._worker.onmessage=function(e){switch(e.data.type){case"ready":n(t);break;case"frame":r({image:t._canvasImageBackup,resizedImage:e.data.resizedImage,segmentationMask:e.data.segmentationMask});break;case"error":null==i||i(e.data);break;default:console.warn("unhandled event type",e.data);}},this._canvas=document.createElement("canvas"),this._canvasImageBackup=document.createElement("canvas");var a=this._canvas.getContext("2d"),s=this._canvasImageBackup.getContext("2d");if(!a||!s)throw new Error("can't get ctx for canvas");this._ctx=a,this._ctxImageBackup=s;}return e.prototype.createModel=function(e){var t,r=this._settings,n=R.segmentation.models[r.modelKey];null===(t=this._worker)||void 0===t||t.postMessage({type:"create",modelPath:n,settings:r,debug:e});},e.prototype.setParams=function(e){var t=this._worker,r=this._settings;Object.assign(r,e),null==t||t.postMessage({type:"params",params:r});},e.prototype.requestSegmentation=function(e){var t=this,r=t._settings,n=t._canvas,i=t._ctx,o=t._worker,a=t._processSize[r.processSizeKey],s=a[0],u=a[1];this._saveImage(e),n.width=u,n.height=s,i.drawImage(e,0,0,u,s);var c=i.getImageData(0,0,u,s);null==o||o.postMessage({type:"frame",imageData:c},[c.data.buffer]);},e.prototype._saveImage=function(e){var t=this._ctxImageBackup,r=this._canvasImageBackup,n=function(e){var t={height:0,width:0};return "number"==typeof e.height?t.height=e.height:t.height=e.height.baseVal.value,"number"==typeof e.width?t.width=e.width:t.width=e.width.baseVal.value,t}(e),i=n.height,o=n.width;r.height=i,r.width=o,t.clearRect(0,0,o,i),t.drawImage(e,0,0,o,i);},e.prototype.destroy=function(){this._worker&&(this._worker.terminate(),this._worker=null);},e}(),D=function(e){var t,r,n=e.defaults,i=e.track,o=i.getSettings(),a=i.getConstraints(),s=n;return r=["width","height"],"object"==typeof(t=o)&&(Array.isArray(r)?r.every((function(e){return e in t})):r in t)||!function(e){return "object"==typeof e?Array.isArray(e)?!e.length:!Object.keys(e).length:"string"==typeof e?!e.length:!e}(a)?(o.height?s.height=o.height:"number"==typeof a.height?s.height=a.height:"object"==typeof a.height&&(s.height=a.height.exact||a.height.ideal||a.height.max||a.height.min||s.height),o.width?s.width=o.width:"number"==typeof a.width?s.width=a.width:"object"==typeof a.width&&(s.width=a.width.exact||a.width.ideal||a.width.max||a.width.min||s.width),s):s},F=function(){function e(){}return e.updateSegmentationParams=function(t){Object.assign(e._params.segmentation,t);},e.getSegmentationParams=function(){return e._params.segmentation},e.setDebug=function(t){e._params.debug=t;},e.getDebug=function(){return !!e._params.debug},e._params={segmentation:{processSizeKey:"192x256",modelKey:"192x256"}},e}(),U=function(){function e(){this._timeouts=new Map,this._throttles=new Map,this._worker=new Worker(o(e.workerFn));}return e.prototype.initWorker=function(e){var t=void 0===e?{}:e,i=t.onError,o=t.onTimeout,a=t.onThrottle,s=t.onReady;return r(this,void 0,void 0,(function(){var e=this;return n(this,(function(t){return [2,new Promise((function(t,r){e._worker.addEventListener("message",(function(n){switch(n.data.type){case"timeout":e._callTimeout(n.data.id),null==o||o(n.data);break;case"throttle":e._callThrottle(n.data.id),null==a||a(n.data);break;case"error":null==i||i(n.data),r(n.data);break;case"ready":null==s||s(n.data),t();}})),e._worker.addEventListener("error",(function(e){null==i||i(e),r(e);})),e._worker.postMessage({type:"ready"});}))]}))}))},e.workerFn=function(){var e=new Map,t=new Map;self.onmessage=function(r){switch(r.data.type){case"timeout":!function(t,r){void 0===r&&(r=5);var n=setTimeout((function(){self.postMessage({type:"timeout",id:t}),e.delete(t);}),r);e.set(t,n);}(r.data.id,r.data.ms);break;case"throttle":!function(e,r){void 0===r&&(r=5);var n=t.get(e);n&&clearTimeout(n);var i=setTimeout((function(){self.postMessage({type:"throttle",id:e}),t.delete(e);}),r);t.set(e,i);}(r.data.id,r.data.ms);break;case"ready":self.postMessage({type:"ready"});break;default:self.postMessage({type:"error",data:r.data});}},self.postMessage({type:"ready"});},e.prototype.postTimeout=function(e,t,r){void 0===r&&(r=5),this._timeouts.set(e,t),this._worker.postMessage({type:"timeout",id:e,ms:r});},e.prototype.postThrottle=function(e,t,r){void 0===r&&(r=5),this._throttles.set(e,t),this._worker.postMessage({type:"throttle",id:e,ms:r});},e.prototype._callTimeout=function(e){var t=this._timeouts.get(e);t&&(this._timeouts.delete(e),t());},e.prototype._callThrottle=function(e){var t=this._throttles.get(e);t&&(this._throttles.delete(e),t());},e.prototype.destroy=function(){this._worker.terminate(),this._throttles.clear(),this._timeouts.clear();},e}();!function(e){e.NONE="none",e.BLUR="blur",e.BACKGROUND="background";}(p||(p={}));var C=function(){function e(e){var t=void 0===e?{}:e,r=t.segmentation,n=t.debug;this._effect=null,this._net=null,this._video=null,this._videoWaitTimeout=null,this._canvas=null,this._stream=null,this._track=null,this._sendNextFrame=null,this._timerWorker=null,r&&F.updateSegmentationParams(r),n&&F.setDebug(n);}return e.prototype._createDom=function(e){var t=D({track:e,defaults:{height:360,width:640}}),r=t.width,n=t.height;this._canvas||(this._canvas=document.createElement("canvas"),this._canvas.style.pointerEvents="none",this._canvas.style.visibility="hidden",this._canvas.style.position="absolute",this._canvas.style.width="160px",this._canvas.style.height="90px",this._canvas.height=n,this._canvas.width=r,this._canvas.style.bottom="0",this._canvas.style.left="0",this._canvas.style.zIndex="5000",document.body.appendChild(this._canvas)),this._video||(this._video=document.createElement("video"),this._video.controls=!1,this._video.autoplay=!1,this._video.preload="auto",this._video.muted=!0,this._video.style.pointerEvents="none",this._video.style.visibility="hidden",this._video.style.position="absolute",this._video.style.width="160px",this._video.style.height="90px",this._video.height=n,this._video.width=r,this._video.style.bottom="0",this._video.style.right="0",this._video.style.zIndex="5000",document.body.appendChild(this._video));},e.prototype._removeDom=function(){try{this._canvas&&document.body.removeChild(this._canvas),this._video&&document.body.removeChild(this._video);}catch(e){}this._canvas=null,this._video=null;},e.prototype._createStream=function(e){return r(this,void 0,void 0,(function(){var t=this;return n(this,(function(r){if(!this._canvas||!this._video)throw new Error("Video element or canvas not found");return this._stream=this._canvas.captureStream(0),[2,new Promise((function(r,n){var i=t._video;i.srcObject=new MediaStream([e]),i.onloadeddata=function(){var e;i.width=i.videoWidth,i.height=i.videoHeight,t._track=null===(e=t._stream)||void 0===e?void 0:e.getVideoTracks()[0],t._videoWaitTimeout&&(window.clearTimeout(t._videoWaitTimeout),t._videoWaitTimeout=null),r();},i.onerror=function(){return n(new Error("Video element error"))},t._videoWaitTimeout=window.setTimeout((function(){t._videoWaitTimeout=null,n(new Error("Video element timeout"));}),3e3);var o=i.play(),a=function(){return n(new Error("Autoplay is disabled"))};o?o.catch(a):a();}))]}))}))},e.prototype._createNet=function(){return r(this,void 0,void 0,(function(){var e=this;return n(this,(function(t){return [2,new Promise((function(t,r){var n=F.getDebug()?function(){for(var e=[],t=0;t<arguments.length;t++)e[t]=arguments[t];console.warn.apply(console,e),r();}:void 0;new B({onFrame:function(t){e._drawFrame(t);},onReady:t,onError:n}).createModel(F.getDebug());}))]}))}))},e.prototype._removeStream=function(){this._stream&&(this._stream.getTracks().forEach((function(e){return e.stop()})),this._stream=null,this._track=null),this._video&&(this._video.pause(),this._video.srcObject=null),this._videoWaitTimeout&&(window.clearTimeout(this._videoWaitTimeout),this._videoWaitTimeout=null);},e.prototype._drawFrame=function(e){var t,r=this;this._net&&this._video&&this._effect&&this._canvas&&this._video&&this._effect&&(this._effect.draw(e),this._track&&(this._track.requestFrame(),null===(t=this._timerWorker)||void 0===t||t.postTimeout(Date.now(),(function(){r._video&&r._sendNextFrame&&r._sendNextFrame(r._video);}))));},e.prototype._cleanup=function(e){var t=void 0===e?{}:e,r=t.removeWorkerNet,n=t.removeWorkerTimer;this._effect&&(this._effect.destroy(),this._effect=null),this._removeStream(),this._removeDom(),r&&this._net&&(this._net.destroy(),this._net=null),n&&this._timerWorker&&(this._timerWorker.destroy(),this._timerWorker=null);},e.prototype._setEffect=function(e,t){return r(this,void 0,void 0,(function(){var r,i=this;return n(this,(function(n){switch(n.label){case 0:return this._timerWorker?[3,2]:(this._timerWorker=new U,[4,this._timerWorker.initWorker()]);case 1:n.sent(),n.label=2;case 2:return this._net?[3,4]:(r=this,[4,this._createNet()]);case 3:r._net=n.sent(),n.label=4;case 4:return this._effect&&(this._effect=null),this._sendNextFrame=function(e){var t;null===(t=i._timerWorker)||void 0===t||t.postThrottle("img-segm",(function(){var t;null===(t=i._net)||void 0===t||t.requestSegmentation(e);}),1e3/60);},this._removeStream(),this._createDom(t),[4,this._createStream(t)];case 5:if(n.sent(),!this._canvas||!this._video)throw new Error("Video element or canvas not found");return this._effect=e,this._effect.video=this._video,this._effect.canvas=this._canvas,this._sendNextFrame(this._video),[2]}}))}))},e.prototype.setEffect=function(e,t){var i,o;return r(this,void 0,void 0,(function(){var r;return n(this,(function(n){switch(n.label){case 0:if(!e)return this._cleanup(),[2,t];e.effect!==(null===(i=this._effect)||void 0===i?void 0:i.effect)&&(null===(o=this._effect)||void 0===o||o.destroy()),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,this._setEffect(e,t)];case 2:return n.sent(),[2,this._track||t];case 3:throw r=n.sent(),this._cleanup(),r;case 4:return [2]}}))}))},e.prototype.stopEffect=function(){this._cleanup();},Object.defineProperty(e.prototype,"effect",{get:function(){return this._effect?this._effect.effect:p.NONE},enumerable:!1,configurable:!0}),e.prototype.destroy=function(){this._cleanup({removeWorkerNet:!0,removeWorkerTimer:!0});},e}(),S=function(e){var t=e.gl,r=e.fs,n=e.vs,i=t.createShader(t.VERTEX_SHADER);if(!i)throw new Error("vertex shader didn't initialized");t.shaderSource(i,n),t.compileShader(i);var o=t.createShader(t.FRAGMENT_SHADER);if(!o)throw new Error("fragment shader didn't initialized");t.shaderSource(o,r),t.compileShader(o);var a=t.createProgram();if(!a)throw new Error("shader program didn't initialized");if(t.attachShader(a,i),t.attachShader(a,o),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))throw t.getProgramInfoLog(a);return t.deleteShader(i),t.deleteShader(o),{program:a}},M=function(e){var t=e.createTexture();return e.bindTexture(e.TEXTURE_2D,t),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),t},I=function(e,t,r){var n=M(e);if(!n)throw new Error("texture was not created");e.texImage2D(e.TEXTURE_2D,0,e.RGBA,t,r,0,e.RGBA,e.UNSIGNED_BYTE,null);var i=e.createFramebuffer();if(!i)throw new Error("framebuffer was not created");return e.bindFramebuffer(e.FRAMEBUFFER,i),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0),{framebuffer:i,texture:n}},L=function(e,t,r,n){e.bindTexture(e.TEXTURE_2D,t),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,n,0,e.RGBA,e.UNSIGNED_BYTE,null),e.bindTexture(e.TEXTURE_2D,null);},O=function(e,t){e.bindFramebuffer(e.FRAMEBUFFER,t),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.bindFramebuffer(e.FRAMEBUFFER,null);},P=function(e,t){return {aTextureCoord:e.getAttribLocation(t,"aTextureCoord"),aVertexCoord:e.getAttribLocation(t,"aVertexCoord")}},W="attribute vec3 aVertexCoord;\nattribute vec2 aTextureCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n  gl_Position = vec4(aVertexCoord, 1.0);\n  vTextureCoord = aTextureCoord;\n}",G=function(){function e(e){var t=this;this.gl=e,this.program=S({fs:"precision highp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uAlphaTexture;\nuniform float uLowerBound;\nuniform float uUpperBound;\n\nvoid main(void) {\n  vec4 color = texture2D(uAlphaTexture, vTextureCoord);\n  if (color.a < uLowerBound) {\n    color.a = 0.0;\n  } else {\n    if (color.a < uUpperBound) {\n      color.a = (color.a - uLowerBound) / (uUpperBound - uLowerBound);\n    } else {\n      color.a = 1.0;\n    }\n  }\n  gl_FragColor = color;\n}",gl:e,vs:W}).program,this.uniforms={uAlphaTexture:function(e){var r=t.gl.getUniformLocation(t.program,"uAlphaTexture");t.gl.uniform1i(r,e);},uLowerBound:function(e){var r=t.gl.getUniformLocation(t.program,"uLowerBound");t.gl.uniform1f(r,e);},uUpperBound:function(e){var r=t.gl.getUniformLocation(t.program,"uUpperBound");t.gl.uniform1f(r,e);}},this.attributes=P(this.gl,this.program);}return e.prototype.bind=function(){this.gl.useProgram(this.program);},e.prototype.destroy=function(){this.gl.deleteProgram(this.program);},e}(),j=function(){function e(e){var t=this;this.gl=e,this.program=S({fs:"precision highp float;\n\nuniform sampler2D uCameraFrameTexture;\nuniform sampler2D uBackgroundTexture;\nuniform sampler2D uAlphaTexture;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n  vec4 cameraFrameColor = texture2D(uCameraFrameTexture, vTextureCoord);\n  vec4 backgroundColor = texture2D(uBackgroundTexture, vTextureCoord);\n  vec4 alphaMask = texture2D(uAlphaTexture, vTextureCoord);\n  gl_FragColor = mix(backgroundColor, cameraFrameColor, alphaMask.a);\n}",gl:e,vs:W}).program,this.uniforms={uAlphaTexture:function(e){var r=t.gl.getUniformLocation(t.program,"uAlphaTexture");t.gl.uniform1i(r,e);},uCameraFrameTexture:function(e){var r=t.gl.getUniformLocation(t.program,"uCameraFrameTexture");t.gl.uniform1i(r,e);},uBackgroundTexture:function(e){var r=t.gl.getUniformLocation(t.program,"uBackgroundTexture");t.gl.uniform1i(r,e);}},this.attributes=P(this.gl,this.program);}return e.prototype.bind=function(){this.gl.useProgram(this.program);},e.prototype.destroy=function(){this.gl.deleteProgram(this.program);},e}(),N=function(){function e(e){var t=this;this.gl=e,this.program=S({fs:"// https://github.com/Jam3/glsl-fast-gaussian-blur\n\nprecision highp float;\n\nuniform sampler2D texture;\nuniform vec3 iResolution;\nuniform bool flip;\nuniform vec2 direction;\n\nvec4 blur5(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.3333333333333333) * direction;\n  color += texture2D(image, uv) * 0.29411764705882354;\n  color += texture2D(image, uv + (off1 / resolution)) * 0.35294117647058826;\n  color += texture2D(image, uv - (off1 / resolution)) * 0.35294117647058826;\n  return color;\n}\n\nvec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.3846153846) * direction;\n  vec2 off2 = vec2(3.2307692308) * direction;\n  color += texture2D(image, uv) * 0.2270270270;\n  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;\n  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;\n  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;\n  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;\n  return color;\n}\n\nvec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.411764705882353) * direction;\n  vec2 off2 = vec2(3.2941176470588234) * direction;\n  vec2 off3 = vec2(5.176470588235294) * direction;\n  color += texture2D(image, uv) * 0.1964825501511404;\n  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;\n  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;\n  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;\n  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;\n  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;\n  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;\n  return color;\n}\n\nvoid main() {\n  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);\n  if (flip) {\n    uv.y = 1.0 - uv.y;\n  }\n\n  gl_FragColor = blur13(texture, uv, iResolution.xy, direction);\n}",gl:e,vs:"attribute vec3 position;\n\nvoid main() { gl_Position = vec4(position, 1.0); }"}).program,this.uniforms={texture:function(e){var r=t.gl.getUniformLocation(t.program,"texture");t.gl.uniform1i(r,e);},iResolution:function(e,r,n){var i=t.gl.getUniformLocation(t.program,"iResolution");t.gl.uniform3f(i,e,r,n);},flip:function(e){var r=t.gl.getUniformLocation(t.program,"flip");t.gl.uniform1f(r,e);},direction:function(e,r){var n=t.gl.getUniformLocation(t.program,"direction");t.gl.uniform2f(n,e,r);}},this.attributes={position:this.gl.getAttribLocation(this.program,"position")};}return e.prototype.bind=function(){this.gl.useProgram(this.program);},e.prototype.destroy=function(){this.gl.deleteProgram(this.program);},e}(),z=function(){function e(e){var t=this;this.gl=e,this.program=S({fs:"precision highp float;\n\nuniform sampler2D uTextureOriginal;\nuniform sampler2D uTextureMask;\nuniform vec3 iResolution;\nuniform bool flip;\nuniform vec2 direction;\n\nvec4 blur13(sampler2D image, sampler2D maskTexture, vec2 uv, vec2 resolution,\n            vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.411764705882353) * direction;\n  vec2 off2 = vec2(3.2941176470588234) * direction;\n  vec2 off3 = vec2(5.176470588235294) * direction;\n  float sumCof = 0.0;\n\n  vec4 c = texture2D(image, uv);\n  vec4 m = texture2D(maskTexture, uv);\n  color += c * 0.1964825501511404 * (1.0 - m.a);\n  sumCof += 0.1964825501511404 * (1.0 - m.a);\n\n  c = texture2D(image, uv + (off1 / resolution));\n  m = texture2D(maskTexture, uv + (off1 / resolution));\n  color += c * 0.2969069646728344 * (1.0 - m.a);\n  sumCof += 0.2969069646728344 * (1.0 - m.a);\n\n  c = texture2D(image, uv - (off1 / resolution));\n  m = texture2D(maskTexture, uv - (off1 / resolution));\n  color += c * 0.2969069646728344 * (1.0 - m.a);\n  sumCof += 0.2969069646728344 * (1.0 - m.a);\n\n  c = texture2D(image, uv + (off2 / resolution));\n  m = texture2D(maskTexture, uv + (off2 / resolution));\n  color += c * 0.09447039785044732 * (1.0 - m.a);\n  sumCof += 0.09447039785044732 * (1.0 - m.a);\n\n  c = texture2D(image, uv - (off2 / resolution));\n  m = texture2D(maskTexture, uv - (off2 / resolution));\n  color += c * 0.09447039785044732 * (1.0 - m.a);\n  sumCof += 0.09447039785044732 * (1.0 - m.a);\n\n  c = texture2D(image, uv + (off3 / resolution));\n  m = texture2D(maskTexture, uv + (off3 / resolution));\n  color += c * 0.010381362401148057 * (1.0 - m.a);\n  sumCof += 0.010381362401148057 * (1.0 - m.a);\n\n  c = texture2D(image, uv - (off3 / resolution));\n  m = texture2D(maskTexture, uv - (off3 / resolution));\n  color += c * 0.010381362401148057 * (1.0 - m.a);\n  sumCof += 0.010381362401148057 * (1.0 - m.a);\n\n  return sumCof > 0.0 ? color / sumCof : vec4(0.0, 0.0, 0.0, 0.0);\n}\n\nvoid main() {\n  vec2 uv = vec2(gl_FragCoord.xy / iResolution.xy);\n\n  if (flip) {\n    uv.y = 1.0 - uv.y;\n  }\n\n  gl_FragColor =\n      blur13(uTextureOriginal, uTextureMask, uv, iResolution.xy, direction);\n}",gl:e,vs:"attribute vec3 position;\n\nvoid main() { gl_Position = vec4(position, 1.0); }"}).program,this.uniforms={uTextureOriginal:function(e){var r=t.gl.getUniformLocation(t.program,"uTextureOriginal");t.gl.uniform1i(r,e);},uTextureMask:function(e){var r=t.gl.getUniformLocation(t.program,"uTextureMask");t.gl.uniform1i(r,e);},iResolution:function(e,r,n){var i=t.gl.getUniformLocation(t.program,"iResolution");t.gl.uniform3f(i,e,r,n);},flip:function(e){var r=t.gl.getUniformLocation(t.program,"flip");t.gl.uniform1f(r,e);},direction:function(e,r){var n=t.gl.getUniformLocation(t.program,"direction");t.gl.uniform2f(n,e,r);}},this.attributes={position:this.gl.getAttribLocation(this.program,"position")};}return e.prototype.bind=function(){this.gl.useProgram(this.program);},e.prototype.destroy=function(){this.gl.deleteProgram(this.program);},e}(),X=function(){function e(e){this.textures={background:null,image:null,resizedImage:null,segmentationMask:null},this.parameters={blurStrength:.8,fixSegmentation:!0,fixSegmentationBlurStrength:.25,fixSegmentationIterations:8,alphaCutterLowerBound:.4,alphaCutterUpperBound:.6},this.$canvas=e;var t=this.$canvas.getContext("webgl");if(!t)throw new Error("getting ctx failed");this.gl=t;var r=this.gl;this.onresize=this.onresize.bind(this),this.onresize(),this.pBlurFastWithMask=new z(this.gl),this.pBackgroundComposer=new j(this.gl),this.pBlurFast=new N(this.gl),this.pAlphaCutter=new G(this.gl),this.vertices=[1,1,0,1,1,1,-1,0,1,0,-1,-1,0,0,0,-1,1,0,0,1],this.indices=[0,1,3,1,2,3];var n=r.createBuffer(),i=r.createBuffer();if(!n||!i)throw new Error("create buffer error");this.positionBuffer=n,this.indexBuffer=i,r.bindBuffer(r.ARRAY_BUFFER,this.positionBuffer),r.bufferData(r.ARRAY_BUFFER,new Float32Array(this.vertices),r.STATIC_DRAW),r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,this.indexBuffer),r.bufferData(r.ELEMENT_ARRAY_BUFFER,new Uint16Array(this.indices),r.STATIC_DRAW),this.fbs={blur:this.createTextureLayers(),segmentationFix:this.createTextureLayers()},this.textures={background:M(r),image:M(r),resizedImage:M(r),segmentationMask:M(r)},window.addEventListener("resize",this.onresize);}return e.prototype.onresize=function(){var e=this,t=e.$canvas,r=e.gl,n=e.fbs,i=t.width||t.clientWidth,o=t.height||t.clientHeight;t.width=i,t.height=o,r.viewport(0,0,i,o),n&&function(e,t){for(var r=t.height,n=t.width,i=[],o=2;o<arguments.length;o++)i[o-2]=arguments[o];i.forEach((function(t){t.forEach((function(t){O(e,t.framebuffer),L(e,t.texture,n,r);}));}));}(r,{width:i,height:o},n.blur,n.segmentationFix);},e.prototype.loadTextures=function(e){var t=e.image,r=e.resizedImage,n=e.segmentationMask,i=e.background,o=this.gl,a=this.textures;return o.bindTexture(o.TEXTURE_2D,a.image),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,t),i||(o.bindTexture(o.TEXTURE_2D,a.resizedImage),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,r)),o.bindTexture(o.TEXTURE_2D,a.segmentationMask),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,n),i&&(o.bindTexture(o.TEXTURE_2D,a.background),o.texImage2D(o.TEXTURE_2D,0,o.RGBA,o.RGBA,o.UNSIGNED_BYTE,i)),o.bindTexture(o.TEXTURE_2D,null),a},e.prototype.close=function(){var e=this,t=e.gl,r=e.positionBuffer,n=e.indexBuffer,i=e.pBackgroundComposer,o=e.pBlurFast,a=e.pBlurFastWithMask,s=e.pAlphaCutter,u=e.fbs,c=e.textures;window.removeEventListener("resize",this.onresize),t.bindBuffer(t.ARRAY_BUFFER,null),t.deleteBuffer(r),t.deleteBuffer(n),t.useProgram(null),i.destroy(),o.destroy(),a.destroy(),s.destroy(),function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];t.forEach((function(t){t.forEach((function(t){e.deleteFramebuffer(t.framebuffer),e.deleteTexture(t.texture);}));}));}(t,u.blur,u.segmentationFix),function(e){for(var t=[],r=1;r<arguments.length;r++)t[r-1]=arguments[r];t.forEach((function(t){return e.deleteTexture(t)}));}(t,c.background,c.image,c.resizedImage,c.segmentationMask);},e.prototype.drawGeometry=function(){var e=this,t=e.gl,r=e.indexBuffer,n=e.indices;t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.drawElements(t.TRIANGLES,n.length,t.UNSIGNED_SHORT,0);},e.prototype.createTextureLayers=function(){var e=this.gl,t=this.$canvas,r=t.width,n=t.height;return [I(e,r,n),I(e,r,n)]},e.prototype.setGeometry=function(e,t){var r=this.gl,n=this.positionBuffer;r.bindBuffer(r.ARRAY_BUFFER,n),r.enableVertexAttribArray(e),r.vertexAttribPointer(e,3,r.FLOAT,!1,5*Float32Array.BYTES_PER_ELEMENT,0),void 0!==t&&(r.enableVertexAttribArray(t),r.vertexAttribPointer(t,2,r.FLOAT,!1,5*Float32Array.BYTES_PER_ELEMENT,3*Float32Array.BYTES_PER_ELEMENT));},e.prototype.setParameters=function(e){Object.assign(this.parameters,e);},e.prototype.draw=function(e){var t,r,n=this,i=n.gl,o=n.$canvas,a=n.parameters,s=n.pBlurFastWithMask,u=n.pBackgroundComposer,c=n.pBlurFast,f=n.pAlphaCutter,l=n.fbs,d=a.fixSegmentation,h=a.fixSegmentationBlurStrength,g=a.blurStrength,m=a.fixSegmentationIterations,p=a.alphaCutterLowerBound,v=a.alphaCutterUpperBound,_=o.width,y=o.height;i.clearColor(0,0,0,0),i.clear(i.COLOR_BUFFER_BIT),i.viewport(0,0,_,y),i.disable(i.BLEND),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0);var w=this.loadTextures(e),b=null,x=e.background?w.background:null;if(d){c.bind(),this.setGeometry(c.attributes.position),c.uniforms.iResolution(_,y,0),c.uniforms.flip(0),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,w.segmentationMask),c.uniforms.texture(0);for(var E=0,T=0;T<m;++T){var k=(m-T-1)*h,R=T%2==0?[k,0]:[0,k];(t=c.uniforms).direction.apply(t,R),i.bindFramebuffer(i.FRAMEBUFFER,l.segmentationFix[E%2].framebuffer),this.drawGeometry(),i.bindTexture(i.TEXTURE_2D,l.segmentationFix[E%2].texture),++E;}f.bind(),this.setGeometry(f.attributes.aVertexCoord,f.attributes.aTextureCoord),f.uniforms.uLowerBound(p),f.uniforms.uUpperBound(v),f.uniforms.uAlphaTexture(0),i.bindFramebuffer(i.FRAMEBUFFER,l.segmentationFix[E%2].framebuffer),this.drawGeometry(),b=l.segmentationFix[E%2].texture;}if(!x){s.bind(),this.setGeometry(s.attributes.position),s.uniforms.iResolution(_,y,0),s.uniforms.flip(0),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,b||w.segmentationMask),s.uniforms.uTextureMask(0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,w.resizedImage),s.uniforms.uTextureOriginal(1);var A=0;for(T=0;T<8;++T){k=(8-T-1)*g,R=T%2==0?[k,0]:[0,k];(r=s.uniforms).direction.apply(r,R),i.bindFramebuffer(i.FRAMEBUFFER,l.blur[A%2].framebuffer),this.drawGeometry(),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,l.blur[A%2].texture),++A;}x=l.blur[(A-1)%2].texture;}u.bind(),this.setGeometry(u.attributes.aVertexCoord,u.attributes.aTextureCoord),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,b||w.segmentationMask),u.uniforms.uAlphaTexture(0),i.activeTexture(i.TEXTURE1),i.bindTexture(i.TEXTURE_2D,x),u.uniforms.uBackgroundTexture(1),i.activeTexture(i.TEXTURE2),i.bindTexture(i.TEXTURE_2D,w.image),u.uniforms.uCameraFrameTexture(2),i.bindFramebuffer(i.FRAMEBUFFER,null),this.drawGeometry();},e}(),H=function(){function e(e){this._effect=e;}return Object.defineProperty(e.prototype,"video",{set:function(e){this._video=e;},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"canvas",{set:function(e){this._canvas=e;},enumerable:!1,configurable:!0}),Object.defineProperty(e.prototype,"effect",{get:function(){return this._effect},enumerable:!1,configurable:!0}),e.prototype.destroy=function(){},e}(),Y=function(e){function i(){var t=e.call(this,p.BACKGROUND)||this;return t._imageEdit=new h,t._WebGlBlend=null,t}return t(i,e),i.prototype.setBackgroundImage=function(e){return r(this,void 0,void 0,(function(){var t,r;return n(this,(function(n){switch(n.label){case 0:return t=this,e?[4,l(e)]:[3,2];case 1:return r=n.sent(),[3,3];case 2:r=void 0,n.label=3;case 3:return t._nextBackgroundImage=r,[2]}}))}))},i.prototype._updateBackground=function(){try{if(this._nextBackgroundImage){var e=this._canvas,t=this._imageEdit,r=e.width,n=e.height;this._backgroundImage=t.resize(this._nextBackgroundImage,r,n),delete this._nextBackgroundImage;}}catch(e){console.warn(e);}},i.prototype.draw=function(e){try{if(this._WebGlBlend||(this._WebGlBlend=new X(this._canvas)),this._nextBackgroundImage&&this._updateBackground(),this._WebGlBlend){var t=Object.assign({background:this._backgroundImage},e);this._WebGlBlend.draw(t);}}catch(e){console.warn(e);}},i.prototype.destroy=function(){e.prototype.destroy.call(this),this._WebGlBlend&&(this._WebGlBlend.close(),this._WebGlBlend=null);},i}(H),V=function(e){function r(){var t=e.call(this,p.BLUR)||this;return t._WebGLEffects=null,t._savedOptions=null,t}return t(r,e),r.prototype.draw=function(e){try{this._WebGLEffects||(this._WebGLEffects=new X(this._canvas),this._savedOptions&&this._WebGLEffects.setParameters(this._savedOptions)),this._WebGLEffects.draw(e);}catch(e){console.warn(e);}},r.prototype.setEffects=function(e){this._savedOptions=e,this._WebGLEffects&&this._WebGLEffects.setParameters(e);},r.prototype.destroy=function(){e.prototype.destroy.call(this),this._WebGLEffects&&(this._WebGLEffects.close(),this._WebGLEffects=null);},r}(H);

    const videoEffects = {
        NONE: null,
        BLUR: new V(),
        BACKGROUND: new Y(),
    };

    const IMG_URL = '//st.mycdn.me/static/calls/2023-02-17bg/';
    const backgroundsMap = new Map([
        ['ok_calls_bg1_web_preview.png', 'ok_calls_bg1_web.png'],
        ['ok_calls_bg2_web_preview.png', 'ok_calls_bg2_web.png'],
        ['ok_calls_bg3_web_preview.png', 'ok_calls_bg3_web.png'],
        ['ok_calls_bg6_web_preview.png', 'ok_calls_bg6_web.png'],
        ['ok_calls_bg7_web_preview.png', 'ok_calls_bg7_web.png'],
        ['ok_calls_bg8_web_preview.png', 'ok_calls_bg8_web.png'],
        ['ok_calls_bg9_web_preview.png', 'ok_calls_bg9_web.png'],
        ['ok_calls_bg10_web_preview.png', 'ok_calls_bg10_web.png'],
        ['ok_calls_bg11_web_preview.png', 'ok_calls_bg11_web.png'],
        ['ok_calls_bg12_web_preview.png', 'ok_calls_bg12_web.png'],
        ['ok_calls_bg13_web_preview.png', 'ok_calls_bg13_web.png'],
        ['ok_calls_bg14_web_preview.png', 'ok_calls_bg14_web.png'],
        ['ok_calls_bg15_web_preview.png', 'ok_calls_bg15_web.png'],
    ]);
    function getImgUrl(bg) {
        return IMG_URL + backgroundsMap.get(bg);
    }
    function applyEffect(effect) {
        switch (effect) {
            case effects.BLUR: {
                return hf(videoEffects.BLUR);
            }
            case effects.WITHOUT: {
                return hf(null);
            }
            default: {
                return videoEffects.BACKGROUND.setBackgroundImage(getImgUrl(effect)).then(() => hf(videoEffects.BACKGROUND));
            }
        }
    }

    const SETTINGS_STORAGE_KEY = 'settings';
    const resolutionMap = {
        SD: {
            width: 640,
            height: 360,
        },
        HD: {
            width: 1280,
            height: 720,
        },
    };
    const defaultSettings = {
        mirrorMe: true,
    };
    const storageSettings = storageFactory(defaultSettings, SETTINGS_STORAGE_KEY);

    function l10n(key, params) {
        return pts__default["default"].getLMsg(key, params);
    }

    const KeyCode = {
        BACKSPACE: 8,
        TAB: 9,
        ENTER: 13,
        CMD: 91,
        SHIFT: 16,
        CTRL: 17,
        ALT: 18,
        ESC: 27,
        SPACE: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        INSERT: 45,
        DELETE: 46,
        0: 48,
        1: 49,
        2: 50,
        3: 51,
        4: 52,
        5: 53,
        6: 54,
        7: 55,
        8: 56,
        9: 57,
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        ALL: '*',
    };

    /**
     * @param {Object} obj
     * @return {Object}
     */
    function reverse(obj) {
        const result = {};
        Object.keys(obj).forEach((key) => {
            if (Array.isArray(obj[key])) {
                obj[key].forEach((value) => {
                    result[value] = (result[value] || []).concat(key);
                });
            } else {
                result[obj[key]] = key;
            }
        });
        return result;
    }

    /**
     * @return {String}
     */
    function getOSVersion() {
        const userAgent = window.navigator.userAgent;
        const platform = window.navigator.platform;
        const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
        const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
        const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
        if (macosPlatforms.indexOf(platform) !== -1) {
            return 'Mac OS';
        }
        else if (iosPlatforms.indexOf(platform) !== -1) {
            return 'iOS';
        }
        else if (windowsPlatforms.indexOf(platform) !== -1) {
            return 'Windows';
        }
        else if (/Android/.test(userAgent)) {
            return 'Android';
        }
        else if (/Linux/.test(platform)) {
            return 'Linux';
        }
        return 'Unknown';
    }

    getOSVersion();
    reverse(KeyCode);

    const noiseReduceModsMap = {
        auto: { denoise: true, denoiseAnn: true },
        low: { denoise: true, denoiseAnn: false },
        off: { denoise: false, denoiseAnn: false },
    };
    const defaultResolution = 'SD';

    const isCallEnded = (call) => call.state === "ended" /* CallState.Ended */ || call.state === "rate" /* CallState.Rate */;
    const externalIdToString = (externalId) => {
        if (!externalId) {
            throw new Error('externalId is null or undefined');
        }
        // TODO support multiple devices
        // let result = externalId.id;
        // if (typeof externalId.deviceIdx === 'number') {
        //     result += ':d' + externalId.deviceIdx;
        // }
        return 'string' === typeof externalId ? externalId : externalId.id;
    };
    const getOpponentChatUrl = (opponent) => {
        if (opponent.type === Ke.USER) {
            return `/messages/${opponent.id}`;
        }
        else if (opponent.type === Ke.CHAT) {
            return `/messages/c${String(opponent.id).replace('-', '')}`;
        }
        else {
            return `/group/${opponent.id}`;
        }
    };
    const updateParticipantStream = (participant, mediaType, stream) => {
        const nextUserStreams = new Map(participant.userStreams);
        if (stream) {
            nextUserStreams.set(mediaType, stream);
        }
        else {
            nextUserStreams.delete(mediaType);
        }
        return nextUserStreams;
    };

    /**
     * Функция которая генерируею обработчик для события `onLocalVolume` от `@vkontakte/calls-sdk`
     * https://st.mycdn.me/static/callssdk/2-1-6/doc/
     * `onLocalVolume` - по умолчанию раз в 0.5 секунды генерирует событие с аргументами:
     * `volume: number` - уровень громкости от 0 до 1
     * `isMicEnabled: boolean` - влючен ли микрофон
     * `localVolumeDetectorGenerator` отдает функцию `localVolumeDetector`, которая с помощью `onVolumeLevelReached`
     *  уведомляет о том, что заданный уровень громкости превышен.
     *
     */
    function localVolumeDetectorGenerator(options) {
        const { onVolumeLevelReached, needCheckMicEnabled, vectorLength, volumeLevelDetection, callbackFactorStep, sensitivityCoefficient, onVolumeLevelUpdated, debugCallback, } = options;
        const movingAverage = movingAverageGenerator(vectorLength);
        let callbackFactor = 0;
        let lastReached = false;
        return (...args) => {
            if (debugCallback) {
                debugCallback(args);
            }
            const [volume, isMicEnabled] = args;
            /** Проверяем, нужно ли подсветить свою рамку */
            const reached = volume > volumeLevelDetection;
            if (lastReached !== reached && onVolumeLevelUpdated) {
                onVolumeLevelUpdated(reached, volume);
            }
            lastReached = reached;
            /** если микрофон был включен - обнуляем `callbackFactor` для снижения порога к умолчанию */
            if (callbackFactor !== 0 && isMicEnabled) {
                callbackFactor = 0;
            }
            const volumeAvg = movingAverage(volume);
            if (!needCheckMicEnabled || !isMicEnabled) {
                /** условие порога, срабатывает если процент превышения звука относительно среднего больше порога зависящего от
                 * среднего шума окружения. Т.е. если средний шум `volumeAvg` высокий - порог будет меньше
                 * (будет более чувствительный), так как голос в шумных местах не сделает большого выброса относительно шума.
                 * Если средний шум низкий - порог увеличивается, чтобы убрать срабатывания при тихих звуках (шорох, вздох и т.д.)
                 * */
                if (volume / volumeAvg > (1 + callbackFactor) / sensitivityCoefficient && volume > volumeLevelDetection) {
                    callbackFactor += callbackFactorStep;
                    /** `localVolumeDetectorGenerator` отвечает только за отсылку событий `onVolumeLevelReached`.
                     */
                    onVolumeLevelReached();
                }
            }
        };
    }
    function volumesDetectorGenerator(options) {
        const { onUpdate, volumeLevelDetection, debugCallback } = options;
        /**
         * отвеачет сколько повторений `speaker` будет отображаться в шапке.
         * нужно для того, чтобы имена не мелькали как рамка говорящего.
         * А были более статичны, чтобы их можно было прочесть.
         * */
        const SPEAKER_IN_HEADER_TIMEOUT = 3;
        let lastSpeakers = new Map();
        let lastSpeakersInHeader = [];
        let speakersTime = new Map();
        let speakersInHeader = [];
        return (...args) => {
            if (debugCallback) {
                debugCallback(args);
            }
            const [volumes] = args;
            const nextSpeakersTime = new Map();
            /**
             * Здесь мы отнимаем одну итерацию у всех спикеров.
             */
            speakersTime.forEach((value, id) => {
                if (value - 1 > 0) {
                    nextSpeakersTime.set(id, value - 1);
                }
            });
            /**
             * если добавился говорит новый спикер или уже существующий,
             * то ему выставляем количество итераций = `SPEAKER_IN_HEADER_TIMEOUT`.
             */
            const speakers = volumes.reduce((acc, { uid, volume }) => {
                const id = externalIdToString(uid);
                if (volume > volumeLevelDetection) {
                    acc.set(id, volume);
                    nextSpeakersTime.set(id, SPEAKER_IN_HEADER_TIMEOUT);
                }
                return acc;
            }, new Map());
            speakersTime = nextSpeakersTime;
            speakersInHeader = [...nextSpeakersTime.keys()];
            let speakersChanged = false;
            const result = {
                speakers: lastSpeakers,
                speakersInHeader: lastSpeakersInHeader,
            };
            if (!areEqualDictionaries(lastSpeakers, speakers)) {
                result.speakers = speakers;
                lastSpeakers = speakers;
                speakersChanged = true;
            }
            if (!areEqualArrays(lastSpeakersInHeader, speakersInHeader)) {
                result.speakersInHeader = speakersInHeader;
                lastSpeakersInHeader = speakersInHeader;
                speakersChanged = true;
            }
            if (speakersChanged) {
                onUpdate(result);
            }
        };
    }
    /**
     * Checks if two dictionaries have same keys
     */
    function areEqualDictionaries(mapA, mapB) {
        if (mapA.size !== mapB.size) {
            return false;
        }
        const aKeys = [...mapA.keys()];
        return aKeys.every((key) => mapB.has(key));
    }
    function areEqualArrays(arrA, arrB) {
        if (arrA.length !== arrB.length) {
            return false;
        }
        return arrA.every((keyA, id) => keyA === arrB[id]);
    }
    /**
     * используется алгоритм арифметического скользящего среднего (simple moving average)
     * https://en.wikipedia.org/wiki/Moving_average#Simple_moving_average
     *
     * @param vectorLength количество запоминаемых значений.
     */
    function movingAverageGenerator(vectorLength) {
        const volumeVector = [];
        let volumeSum = 0;
        /** считаем среднее `volumeAvg` за промежуток `vectorLength`
         * `volumeSum` нужна для оптимизации, чтобы каждый раз не считать сумму `volumeVector`
         * */
        return (volume) => {
            volumeVector.push(volume);
            volumeSum += volume;
            if (volumeVector.length > vectorLength) {
                const removedValue = volumeVector.shift();
                volumeSum -= removedValue || 0;
            }
            return volumeSum / volumeVector.length;
        };
    }

    let layoutRegistry = new Map();
    function deleteLayoutsForParticipant(externalId) {
        const availableMediaTypes = [ei.CAMERA, ei.SCREEN];
        const isMainValues = [true, false];
        availableMediaTypes.forEach((mediaType) => {
            isMainValues.forEach((isMain) => {
                layoutRegistry.delete(getRegistryKey({
                    uid: Object.assign(Object.assign({}, externalId), { deviceIdx: 0 }),
                    mediaType,
                    isMain,
                }));
            });
        });
    }
    function destroyUpdateDisplayLayout() {
        layoutRegistry = new Map();
    }
    function getRegistryKey({ isMain, mediaType, streamName, uid, }) {
        const peerId = externalIdToString(uid);
        const mediaTypeKey = mediaType ? `:${mediaType}` : '';
        const streamNameKey = streamName ? `:${streamName}` : '';
        return `${peerId}${mediaTypeKey}${streamNameKey}${isMain ? ':main' : ''}`;
    }

    const DEBUG = document.cookie.indexOf('call_debug=') !== -1;
    const VOLUME_LEVEL_DETECTION = 0.25;
    /**
     * Фабрика сигналингов для сдк
     */
    function signalingFactory() {
        return new Ue();
    }
    function logDebug(...args) {
        if (DEBUG) {
            console.warn(...args);
        }
    }
    /**
     * Возвращает данные об аудио-видео устройствах пользователя
     */
    function getDevices() {
        var _a, _b;
        return {
            audio: mg.getMicrophones(),
            video: mg.getCameras(),
            audioId: (_a = mg.getSavedMicrophone()) === null || _a === void 0 ? void 0 : _a.deviceId,
            videoId: (_b = mg.getSavedCamera()) === null || _b === void 0 ? void 0 : _b.deviceId,
        };
    }
    /**
     * Get media options
     */
    function getMediaOptions(needVideo = false) {
        const mediaOptions = [de.AUDIO];
        if (needVideo) {
            mediaOptions.push(de.VIDEO);
        }
        return mediaOptions;
    }
    /**
     * Сервис для отображения диалога подтверждения действия
     */
    class CallService {
        constructor(store, initialParams) {
            this.store = store;
            this.needRate = false;
            this.accepted = false;
            this.onRemoteRemoved = (externalId) => {
                deleteLayoutsForParticipant(externalId);
                this.updateParticipant(externalId, { status: Sr.HANGUP });
                const participantId = externalId.id;
                const changes = {};
                const { speakers: prevSpeakers, speakersInHeader: prevSpeakersInHeader, oratorId, pinnedId } = this.store.get();
                if (prevSpeakers.has(participantId)) {
                    const speakers = new Map(prevSpeakers);
                    speakers.delete(participantId);
                    changes.speakers = speakers;
                }
                if (prevSpeakersInHeader.includes(participantId)) {
                    changes.speakersInHeader = prevSpeakersInHeader.filter((id) => id !== participantId);
                }
                if (oratorId === participantId) {
                    changes.oratorId = undefined;
                }
                if (pinnedId === participantId) {
                    changes.pinnedId = undefined;
                }
                this.store.set(changes);
                logDebug('onRemoteRemoved', externalId);
            };
            this.onLocalVolume = localVolumeDetectorGenerator({
                onVolumeLevelReached: () => {
                    // "speaking on mute alert" may be here
                },
                onVolumeLevelUpdated: (reached, volume) => {
                    var _a;
                    const { speakers, call: { me }, } = this.store.get();
                    const { isAudioEnabled } = me;
                    const prevVolume = (_a = speakers.get(me.id)) !== null && _a !== void 0 ? _a : 0;
                    const nextVolume = isAudioEnabled && reached ? volume : 0;
                    if (nextVolume !== prevVolume) {
                        const nextSpeakers = new Map(speakers);
                        if (nextVolume > 0) {
                            nextSpeakers.set(me.id, nextVolume);
                        }
                        else {
                            nextSpeakers.delete(me.id);
                        }
                        this.store.set({ speakers: nextSpeakers });
                    }
                },
                needCheckMicEnabled: true,
                volumeLevelDetection: VOLUME_LEVEL_DETECTION,
                vectorLength: 5,
                callbackFactorStep: 0,
                sensitivityCoefficient: 0.45,
            });
            this.onVolumesDetected = volumesDetectorGenerator({
                volumeLevelDetection: VOLUME_LEVEL_DETECTION,
                onUpdate: (result) => {
                    this.store.set(result);
                },
            });
            this.onPush = (conversation) => __awaiter(this, void 0, void 0, function* () {
                logDebug('Incoming call', conversation);
                yield Po(conversation.conversationId, conversation.entityType);
                const { call } = this.store.get();
                if (call && call.state === "outgoing" /* CallState.Outgoing */) {
                    logDebug('Accept concurrent', call);
                    if (this.accepted) {
                        this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, 'accept_duplicate');
                    }
                    void this.accept(call.me.isVideoEnabled);
                    this.accepted = true;
                    return;
                }
            });
            this.onLocalNetworkStatusChanged = (rating) => {
                const { me } = this.store.get().call || {};
                this.update({ me: Object.assign(Object.assign({}, me), { networkStatus: rating }) });
            };
            this.onNetworkStatusChanged = (statuses) => {
                const { call } = this.store.get();
                if (!call || !call.participants.length)
                    return;
                const { participants } = call;
                statuses.forEach(({ uid, rating }) => {
                    const idx = participants.findIndex((p) => p.id === uid.id);
                    if (idx > -1) {
                        participants[idx] = Object.assign(Object.assign({}, participants[idx]), { networkStatus: rating });
                    }
                });
                this.update({ participants });
            };
            this.onApiInit = () => {
                logDebug('_onApiInit');
                uf(DEBUG);
            };
            this.onApiError = (e) => {
                logDebug('Api init error', e);
            };
            this.apiAdapter = new ApiAdapter(store);
            const params = Object.assign(Object.assign({}, initialParams), { platform: 'WEB', clientType: 'PORTAL', 
                /**
                 * Called only on start, further on/off will be only in onLocalStreamUpdate
                 * So really local camera stream will always be in userStreams
                 */
                onLocalStream: (stream, mediaSettings) => __awaiter(this, void 0, void 0, function* () {
                    const devices = getDevices();
                    const prevMe = this.store.get().call.me;
                    const me = Object.assign(Object.assign(Object.assign({}, prevMe), mediaSettings), { userStreams: updateParticipantStream(prevMe, ei.CAMERA, stream) });
                    this.update({ devices, me });
                    yield this.setVirtualBackground();
                    yield this.setAudioVideoSettings();
                    logDebug('onLocalStream', stream, mediaSettings);
                }), 
                /**
                 * Called after onLocalStream, onScreenStream
                 */
                onLocalStreamUpdate: (mediaSettings) => {
                    // TODO make comparison to prevent excessive rerenders
                    this.update({ me: Object.assign(Object.assign({}, this.store.get().call.me), mediaSettings) });
                    logDebug('onLocalStreamUpdate', mediaSettings);
                }, 
                /**
                 * Called before onLocalStreamUpdate each time when user switches screen sharing
                 */
                onScreenStream: (stream, mediaSettings) => {
                    const prevMe = this.store.get().call.me;
                    this.update({
                        me: Object.assign(Object.assign(Object.assign({}, prevMe), mediaSettings), { userStreams: updateParticipantStream(prevMe, ei.SCREEN, stream) }),
                    });
                    logDebug('onScreenStream', prevMe.id, stream);
                }, onRemoteStream: (externalId, stream) => {
                    this.updateParticipantStream(externalId, ei.CAMERA, stream);
                    logDebug('onRemoteStream', externalId, stream);
                }, onRemoteScreenStream: (externalId, stream) => {
                    this.updateParticipantStream(externalId, ei.SCREEN, stream);
                    logDebug('onRemoteScreenStream', externalId, stream);
                }, onRemoteMediaSettings: (id, mediaSettings) => {
                    // Оптимистично проставим статус соединения и обновим медиа
                    this.updateParticipant(id, mediaSettings);
                    logDebug('onRemoteMediaSettings', id, mediaSettings);
                }, onRemoteRemoved: this.onRemoteRemoved, onConversation: (uid, mediaModifiers, muteStates, incomingParticipants = []) => {
                    logDebug('onConversation', uid, muteStates, incomingParticipants);
                    this.store.ok.setCallInProgress(true);
                    this.update({ mediaModifiers });
                    incomingParticipants.forEach(({ uid: { id }, status }) => {
                        this.updateParticipant(id, { status });
                    });
                    const { participants } = this.store.get().call;
                    this.update({ participants: getIncomingParticipantsFromStore(participants, incomingParticipants) });
                    function getIncomingParticipantsFromStore(participants, incomingParticipants) {
                        return participants.filter((it) => incomingParticipants.find((ip) => it.id === ip.uid.id));
                    }
                }, onDeviceChange: () => {
                    logDebug('onDeviceChange');
                    const devices = getDevices();
                    this.update({ devices });
                }, onRemoteStatus: (userIds, status, data) => {
                    userIds.forEach((id) => this.updateParticipant(id, { status }));
                    logDebug('onRemoteStatus', userIds, status, data);
                }, onLocalStatus: (status) => {
                    logDebug('onLocalStatus', status);
                }, onPermissionsRequested: () => {
                    logDebug('onPermissionsRequested');
                }, onPermissionsError: (error) => {
                    if (!error) {
                        return;
                    }
                    this.update({ permissionError: error });
                }, onCallState: (isCallActive, canAddParticipants, { participantsLimit, features, roles, topology }) => {
                    logDebug('onCallState', { isCallActive, canAddParticipants, participantsLimit, roles });
                    if (isCallActive) {
                        void this.store.sounds.stopAll();
                        this.stopOlga();
                        this.update({
                            state: "active" /* CallState.Active */,
                            participantsLimit,
                            features,
                            startTime: Date.now(),
                            topology,
                        });
                    }
                    const me = this.store.get().call.me;
                    this.update({ me: Object.assign(Object.assign({}, me), { roles }) });
                }, onRolesChanged: (externalId, roles) => {
                    logDebug('onRolesChanged', externalId, roles);
                    this.updateParticipant(externalId, { roles });
                }, onLocalRolesChanged: (roles) => {
                    logDebug('onLocalRolesChanged', roles);
                    this.update({ me: Object.assign(Object.assign({}, this.store.get().call.me), { roles }) });
                }, onRateNeeded: () => {
                    this.needRate = true;
                }, onSpeakerChanged: ({ id }) => {
                    this.store.set({ oratorId: id });
                    logDebug('onSpeakerChanged', id);
                }, onHangup: (type, conversationId) => __awaiter(this, void 0, void 0, function* () {
                    logDebug('onHangup', type, conversationId);
                    destroyUpdateDisplayLayout();
                    this.accepted = false;
                    this.update({ hangupReason: type });
                    this.apiAdapter.deinit();
                    this.store.ok.unsubscribeChatMessages();
                    this.store.ok.setCallInProgress(false);
                    // Сдк само не вызывает уничтожение логера, и создаются утечки памяти
                    this.store.logger.reset();
                    this.stopOlga();
                    const { call } = this.store.get();
                    // Если статус звонка пропущен - выключаем леер сразу же
                    if ([O$1.MISSED, O$1.CANCELED].includes(type.hangup)) {
                        return this.store.ok.dispose();
                    }
                    const { participants } = this.store.get().call;
                    const nextParticipants = participants.map((p) => (Object.assign(Object.assign({}, p), { status: Sr.HANGUP })));
                    // Звонок уже завершен
                    if (!call.state || ["rate" /* CallState.Rate */, "ended" /* CallState.Ended */].includes(call.state)) {
                        this.update({ streaming: undefined, participants: nextParticipants });
                        return;
                    }
                    yield this.store.sounds.stopAll();
                    void this.store.sounds.playSound("call_finished" /* Sounds.call_finished */);
                    this.update({
                        state: this.needRate ? "rate" /* CallState.Rate */ : "ended" /* CallState.Ended */,
                        streaming: undefined,
                        participants: nextParticipants,
                    });
                }), onCallAccepted: () => {
                    this.accepted = true;
                    logDebug('onCallAccepted');
                }, onVolumesDetected: this.onVolumesDetected, onLocalVolume: this.onLocalVolume, onRecordStarted: (initiator, movieId, startTime, type) => {
                    const participant = this.getParticipant(initiator.id);
                    if (!participant) {
                        return console.warn(`Participant is not found by id ${initiator.id}`);
                    }
                    const streaming = {
                        initiator: participant,
                        movieId,
                        startTime,
                        type,
                    };
                    this.update({ streaming });
                    this.updatePreview();
                }, onRecordStopped: () => {
                    this.update({ streaming: undefined });
                    window.clearTimeout(this.updateTimer);
                }, onMultipartyChatCreated: (conversation) => {
                    logDebug('onMultipartyChatCreated', conversation);
                    this.store.set({
                        call: Object.assign(Object.assign({}, this.store.get().call), { conversationId: conversation.id, chatId: String(conversation.chatId), opponent: { id: String(conversation.chatId), type: Ke.CHAT } }),
                    });
                }, onJoinLinkChanged: (link) => {
                    this.update({ link });
                }, onParticipantJoined: (externalId) => {
                    const { opponent } = this.store.get().call;
                    if (!opponent) {
                        this.update({ opponent: { id: externalId.id, type: Ke.USER } });
                    }
                }, onLocalNetworkStatusChanged: this.onLocalNetworkStatusChanged, onNetworkStatusChanged: this.onNetworkStatusChanged });
            // Переопределение API и логирования и сигналинга для работы в OK
            To(this.apiAdapter);
            Ro(signalingFactory);
            _g(this.store.logger);
            gg(new C());
            this.initialized = Sg(params).then(this.onApiInit).catch(this.onApiError);
        }
        accept(needVideo = false) {
            // Оптимистичное обновление стейта активности звонка
            this.update({ state: "joining" /* CallState.Joining */ });
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, needVideo ? 'accept_videocall' : 'accept_audiocall');
            return Tg(getMediaOptions(needVideo));
        }
        join(conversationId, chatId, needVideo) {
            this.update({ state: "joining" /* CallState.Joining */ });
            return yo(conversationId, getMediaOptions(needVideo), chatId);
        }
        joinByLink(link, needVideo, userToken) {
            this.update({ state: "joining" /* CallState.Joining */ });
            return Pg(link, getMediaOptions(needVideo), userToken);
        }
        create() {
            return __awaiter(this, void 0, void 0, function* () {
                const link = yield qg();
                this.update({ link });
                return link;
            });
        }
        start(id, type, needVideo) {
            // id = type === CallType.GROUP ? `g${id}` : `u${id}`;
            this.update({ state: "outgoing" /* CallState.Outgoing */ });
            const { call } = this.store.get();
            // Если перезваниваем сбросим всем статус видео
            if (call.participants.length > 0) {
                call.participants.forEach((participant) => {
                    this.updateParticipant(String(participant.id), { isVideoEnabled: false });
                });
            }
            return Co([Number(id)], type, getMediaOptions(needVideo));
        }
        /**
         * Now uses tmp implementation in ApiAdapter
         * TODO Depends on VSRV-7720 or VSRV-8518
         */
        createLink() {
            return __awaiter(this, void 0, void 0, function* () {
                const link = yield zg();
                this.update({ link });
                return link;
            });
        }
        /**
         * Положить трубку
         */
        hangup() {
            this.stopOlga();
            const { call: { state }, } = this.store.get();
            // Звонок уже завершен
            if (!state || ["rate" /* CallState.Rate */, "ended" /* CallState.Ended */].includes(state)) {
                return;
            }
            void this.store.sounds.stopAll();
            // Оптимистично добавим статус завершения
            this.update({ state: this.needRate ? "rate" /* CallState.Rate */ : "ended" /* CallState.Ended */ });
            void this.store.sounds.playSound("call_finished" /* Sounds.call_finished */);
            if (state === "incoming" /* CallState.Incoming */) {
                this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, 'decline_call');
                void Rg();
            }
            else {
                this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, 'hangup');
                void yg();
            }
            if (!state || ["outgoing" /* CallState.Outgoing */, "incoming" /* CallState.Incoming */, "joining" /* CallState.Joining */].includes(state)) {
                this.store.ok.dispose();
            }
        }
        storeOKData(conversation, okParticipants, opponent) {
            return __awaiter(this, void 0, void 0, function* () {
                const { conversationId, chatId, userId, userToken } = conversation;
                // ХХХ Бывает так, что участников еще нет, но id уже записать может, он нужен для дальнейшей работы
                // сделаем это, как только заведется сокет, все данные прилетят с веба
                if (!okParticipants.length) {
                    okParticipants.push({
                        id: userId,
                        local: true,
                        title: '',
                        avatar: '',
                        type: conversation.entityType,
                    });
                }
                const call = this.store.get().call || {};
                let { me, link } = call;
                // XXX Если не передан оппонент попробуем взять текущего
                if (!opponent) {
                    opponent = call.opponent;
                }
                // XXX  фолбек оппонента для чата
                if (!(opponent === null || opponent === void 0 ? void 0 : opponent.id) && conversation.chatId) {
                    opponent = Object.assign(Object.assign({}, opponent), { id: conversation.chatId, type: Ke.CHAT });
                }
                // XXX Фоолбек оппонента
                if (!(opponent === null || opponent === void 0 ? void 0 : opponent.id) && !conversation.chatId) {
                    opponent = okParticipants.find((p) => !p.local);
                }
                //  Страховка для наличия участников
                if (!call.participants) {
                    this.update({ participants: [] });
                }
                this.storeOKParticipants(okParticipants);
                if (conversation.useLink) {
                    // TODO: надо получать из сигналинга
                    link = location.href;
                }
                okParticipants.forEach((participant) => {
                    if (participant.local && !(me === null || me === void 0 ? void 0 : me.title)) {
                        me = Object.assign(Object.assign(Object.assign({}, me), participant), { isVideoEnabled: conversation.video, userStreams: (me === null || me === void 0 ? void 0 : me.userStreams) || new Map() });
                    }
                    else if (!participant.local && participant.id !== me.id) {
                        this.updateParticipant(participant.id, participant);
                    }
                });
                let state = !conversation.widget ? "active" /* CallState.Active */ : undefined;
                // XXX Костыль для звонка входящего в группу - сразу ставим статус эктив
                // А также для конкурентных вызовов
                // Иначе мапим статусы на наши
                const isIncomingInGroup = conversation.direction === Je.INCOMING && me.type === z$1.GROUP;
                if (!conversation.concurrent && !isIncomingInGroup && !conversation.widget) {
                    switch (conversation.direction) {
                        case 'INCOMING':
                            void this.store.sounds.playSound("call_incoming" /* Sounds.call_incoming */, true);
                            this.loopOlga();
                            state = "incoming" /* CallState.Incoming */;
                            break;
                        case 'OUTGOING':
                            state = "outgoing" /* CallState.Outgoing */;
                            void this.store.sounds.playSound("call_ringing" /* Sounds.call_ringing */, true);
                            break;
                        case 'JOINING':
                            state = "joining" /* CallState.Joining */;
                            break;
                    }
                }
                this.update({ me, state, opponent, conversationId, chatId, link, userToken });
                this.store.set({ widget: conversation.widget });
                return this.apiAdapter.setupOKConversation(conversation);
            });
        }
        storeOKParticipants(participants) {
            const cachedParticipants = new Map(this.store.get().cachedParticipants);
            participants.forEach((participant) => {
                cachedParticipants.set(participant.id, participant);
            });
            this.store.set({ cachedParticipants });
        }
        setMediaModifiers(mediaModifiers) {
            this.update({ mediaModifiers });
            return Hg(mediaModifiers);
        }
        /**
         * Вкл/выкл локального видео
         */
        toggleLocalVideo() {
            const { call } = this.store.get();
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, call.me.isVideoEnabled ? 'cam_1' : 'cam_0');
            wg(!call.me.isVideoEnabled).catch(() => {
                // TODO: Нужен PTS
                // this.toast.show(this.l10n('call-permission-error'));
            });
        }
        startCallStreaming(data) {
            const { isRecord, name, movieId, privacy, groupId } = data;
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, isRecord ? 'call_recording_started' : 'call_streaming_started');
            void Zg(isRecord, name, movieId, privacy, groupId);
        }
        stopCallStreaming(isRecord) {
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, isRecord ? 'call_recording_stopped' : 'call_streaming_stopped');
            void ef();
        }
        /**
         * Переключает режим шэрига экрана
         */
        toggleScreenSharing(stream) {
            const { call } = this.store.get();
            if (stream) {
                return Og(stream, true);
            }
            if ((call === null || call === void 0 ? void 0 : call.state) === "active" /* CallState.Active */) {
                const { isVideoEnabled, isScreenSharingEnabled } = call.me;
                this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, isScreenSharingEnabled ? 'screen_1' : 'screen_0');
                // Выключаем шэринг. Смотрим, в каком состоянии были: если камера
                // не была включена, нам надо вырубить весь видео-поток
                Dg(!isScreenSharingEnabled).catch((err) => {
                    if (!isScreenSharingEnabled) {
                        // Не удалось включить шэринг экрана. Например, пользователь
                        // отказал в доступе. Вернём камеру обратно, если она была включена
                        if (isVideoEnabled) {
                            return Dg(false);
                        }
                        return Promise.reject(err);
                    }
                });
            }
        }
        /**
         * Вкл/выкл локального звука
         */
        toggleLocalAudio() {
            const { call } = this.store.get();
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, call.me.isAudioEnabled ? 'mic_1' : 'mic_0');
            xg(!call.me.isAudioEnabled).catch(() => {
                // TODO: Нужен PTS
                // this.store.toaster.add(this.l10n('call-permission-error'));
            });
        }
        /**
         * Смена устройства для видео
         */
        changeVideo(deviceId) {
            return this.changeDevice(deviceId, 'videoinput');
        }
        /**
         * Смена устройства для аудио
         */
        changeAudio(deviceId) {
            return this.changeDevice(deviceId, 'audioinput');
        }
        /**
         * Смена устройства для выхода (динамики)
         */
        changeOutput(deviceId) {
            return this.changeDevice(deviceId, 'audiooutput');
        }
        updateDevices(data) {
            this.update({ devices: Object.assign(Object.assign({}, this.store.get().call.devices), data) });
        }
        /**
         * Снимать стрим с нового устройства
         */
        changeDevice(deviceId, kind) {
            return __awaiter(this, void 0, void 0, function* () {
                logDebug('change device', deviceId, kind);
                const changeDevicePromise = yield Ag(kind, deviceId);
                const devices = getDevices();
                this.update({ devices });
                logDebug('update devices', devices);
                return changeDevicePromise;
            });
        }
        /**
         * Если есть права доступа, можно выключить звук удаленному участнику
         */
        muteParticipant(participantId) {
            void Do({
                uid: Number(participantId),
                muteStates: { [de.AUDIO]: xe.MUTE },
            });
        }
        /**
         * Выключить микрофон всем участникам
         */
        muteAll() {
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, 'mute_all');
            this.store.get().call.participants.forEach((participant) => {
                this.muteParticipant(participant.id);
            });
        }
        getLocalId(participantId) {
            return `${participantId}`.replace(/^\D+/, '');
        }
        /**
         * Получить участника по id
         */
        getParticipant(id) {
            var _a, _b;
            const { call } = this.store.get();
            if (id === ((_a = call.me) === null || _a === void 0 ? void 0 : _a.id)) {
                return call.me;
            }
            return call && ((_b = call.participants) === null || _b === void 0 ? void 0 : _b.find((p) => p.id === id));
        }
        navigateToChat() {
            const { call } = this.store.get();
            const { opponent } = call;
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, 'message');
            if (!opponent) {
                this.disposeOrMinimize();
            }
            else {
                const url = getOpponentChatUrl(opponent);
                if (opponent.type === Ke.USER || opponent.type === Ke.CHAT) {
                    this.store.set({ controls: Object.assign(Object.assign({}, this.store.get().controls), { newMessagesCount: 0 }) });
                }
                if (window.location.pathname !== url) {
                    // OK has bugs when navigation is done to current url
                    this.store.ok.navigate(url);
                }
                else {
                    this.disposeOrMinimize();
                }
            }
        }
        updateParticipantStream(identifier, mediaType, stream) {
            const participant = this.store.get().call.participants.find((p) => p.id === identifier.id);
            if (participant) {
                const data = {
                    userStreams: updateParticipantStream(participant, mediaType, stream),
                };
                this.updateParticipant(identifier, data);
            }
        }
        /**
         * Метод для быстрого иммутабильного обновления данных участника звонка
         * */
        updateParticipant(identifier, data) {
            let id;
            let type = undefined;
            if (typeof identifier === 'object') {
                id = identifier.id;
                type = identifier.type;
            }
            else {
                id = identifier;
            }
            data = Object.assign(Object.assign({}, data), this.ensureParticipantData(id, type));
            this.mergeParticipant(id, data);
        }
        disposeOrMinimize() {
            const { call, expanded } = this.store.get();
            if (isCallEnded(call)) {
                this.store.ok.dispose();
            }
            else if (expanded) {
                this.store.toggleExpanded(false);
            }
        }
        /**
         * Иммутабильное обновление данных участника в сторе
         */
        mergeParticipant(id, data) {
            var _a;
            let { participants = [] } = this.store.get().call || {};
            participants = participants.slice();
            const idx = participants.findIndex((p) => p.id === id);
            const participant = participants[idx];
            if (participant) {
                participants[idx] = Object.assign(Object.assign({}, participant), data);
            }
            else {
                participants.push(Object.assign(Object.assign({}, data), { id, userStreams: (_a = data.userStreams) !== null && _a !== void 0 ? _a : new Map() }));
            }
            this.update({ participants });
        }
        /**
         * Сброс данных звонка, минимальный для начала нового звонка на базе текущего store
         */
        reset() {
            this.update({ conversationId: null, startTime: 0, permissionError: undefined });
            this.accepted = false;
        }
        /**
         * Иммутабильное Обновление данных звонка в нужной ветке в сторе
         */
        update(data) {
            const { call } = this.store.get();
            return this.store.set({ call: Object.assign(Object.assign({}, call), data) });
        }
        /**
         * Обновление превью при записи звонка
         */
        updatePreview() {
            const updateNow = () => {
                rf().then((resp) => {
                    var _a;
                    const { streaming } = (_a = this.store.get()) === null || _a === void 0 ? void 0 : _a.call;
                    if (streaming) {
                        const preview = resp.preview + `&_ts=${Date.now()}`;
                        const res = Object.assign(Object.assign({}, streaming), { preview });
                        this.update({ streaming: res });
                    }
                    this.updateTimer = window.setTimeout(updateNow, 5000);
                });
            };
            updateNow();
        }
        /**
         * Страхует данные пользователя для постоянного наличия в них avatar и title
         */
        ensureParticipantData(id, type = z$1.USER) {
            const participant = this.getParticipant(id);
            // Ничего не нужно делать все данные на месте
            if ((participant === null || participant === void 0 ? void 0 : participant.title) || (participant === null || participant === void 0 ? void 0 : participant.avatar)) {
                return null;
            }
            const { cachedParticipants } = this.store.get();
            if (cachedParticipants.has(id)) {
                return cachedParticipants.get(id);
            }
            // Сделаем запрос на сервер и вмержим результат
            // На время запроса положим заглушку в кеш, чтобы не запрашивать дважды
            // Если вдруг сеть медленная
            cachedParticipants.set(id, { id, title: '', avatar: '', local: false, type });
            this.store.ok.fetchParticipants([id]).then(([res]) => {
                cachedParticipants.set(res.id, res);
                this.mergeParticipant(id, res);
            });
            return null;
        }
        /**
         * Включает циклическое проигрывание звука "Вам звонят на одноклассниках"
         */
        loopOlga() {
            if (this.olgaTimeout) {
                return;
            }
            this.olgaTimeout = window.setTimeout(() => {
                void this.store.sounds.playSound("call_olga" /* Sounds.call_olga */);
                this.olgaTimeout && this.loopOlga();
            }, 20000);
        }
        /**
         * Выключает циклическое проигрывание звука "Вам звонят на одноклассниках"
         */
        stopOlga() {
            window.clearTimeout(this.olgaTimeout);
            delete this.olgaTimeout;
        }
        /**
         * Активирует виртуальный фон, если предустановлен
         */
        setVirtualBackground() {
            return __awaiter(this, void 0, void 0, function* () {
                const { activeEffect } = vbStorageSettings.get();
                yield applyEffect(activeEffect);
            });
        }
        /**
         * Устанавливает сохраненные настройки аудио и видео
         */
        setAudioVideoSettings() {
            return __awaiter(this, void 0, void 0, function* () {
                const settings = storageSettings.get();
                const promises = [];
                if (settings.modifiersId) {
                    promises.push(this.setMediaModifiers(noiseReduceModsMap[settings.modifiersId]));
                }
                const resolutionToSet = resolutionMap[settings.videoResolution || defaultResolution];
                promises.push(Lg({ video: resolutionToSet, effect: resolutionToSet }));
                yield Promise.allSettled(promises).then((results) => {
                    results.forEach((result) => {
                        if (result.status === 'rejected') {
                            this.store.logger.error(`initial audio video settings error: ${result.reason}`);
                        }
                    });
                });
            });
        }
    }

    class Import {
        static require(modulesPath) {
            return new Promise((resolve) => {
                window.require(modulesPath, (...modulesImpl) => resolve(modulesImpl));
            });
        }
        static module(name, cb) {
            if (this.defined(name)) {
                const module = window.require(name);
                if (cb) {
                    cb(module);
                }
                return module;
            }
        }
        static defined(name) {
            return window.require && window.require.defined(name);
        }
    }

    class OKService {
        constructor(store) {
            this.store = store;
            this.layerId = 'videochat';
            this.store.get();
        }
        dispose() {
            // XXX Виджет не удаляем
            if (!this.store.get().widget) {
                OK.hookModel.setHookContent('VideoChatCall', '');
            }
        }
        openSupportLayer() {
            this.store.logger.log("callUiAction" /* Stat.UI_ACTION */, 'support');
            requestUpdateBlockModel('/dk', {
                cmd: 'PopLayer',
                'st.layer.cmd': 'PopLayerHelpFeedback',
                'st.layer.dCategory': 'on',
                'st.layer.categorynew': 'SITE_SECTION',
                'st.layer.subcategory': 'COMMUNICATION',
                'st.layer.origin': 'VIDEOCHAT_LAYER',
                'st.layer.dSubject': 'on',
                'st.cmd': OK.getCurrentDesktopModelId(),
            });
        }
        /**
         * Отправить оценку качества звонка
         */
        submitRate(rate, votes, comment) {
            const data = {
                'st.callvote.cid': this.store.get().call.conversationId,
                'st.callvote.rt': rate,
            };
            if (votes) {
                data['st.callvote.ans'] = votes.join(',');
            }
            if (comment) {
                data['st.callvote.cmt'] = comment;
            }
            console.log('SEND FEEDBACK DATA: ', data);
            return vanillaAjax({
                url: '/web-api/videochat/vote',
                data: data,
            });
        }
        /**
         * Запрос ссылки на статику
         */
        getStatic() {
            return OK.cnst.staticUrl;
        }
        navigate(url) {
            window.navigateOnUrlFromJS(url);
        }
        openLayer(conversation) {
            const data = {
                cmd: 'VideoChatCall',
                'st.call.ft': conversation.video ? 'CALL_VIDEO' : 'CALL_AUDIO',
                'st.call.dir': conversation.direction,
            };
            if (conversation.conversationId) {
                data['st.call.conversationId'] = conversation.conversationId;
            }
            if (conversation.chatId) {
                data['st.call.chatId'] = conversation.chatId;
            }
            if (conversation.opponentId) {
                data['st.call.opponentId'] = conversation.opponentId;
            }
            return requestUpdateBlockModel('/dk', data);
        }
        fetchParticipants(ids) {
            return __awaiter(this, void 0, void 0, function* () {
                const { response } = yield vanillaAjax({
                    url: '/dk',
                    data: { cmd: 'VideoChatRemoteParticipantsList2', 'st.call.participantIds': ids },
                });
                const { participants } = OK.util.parseJsonCorrected(response);
                // XXX Временный фикс проблемы на проде
                return participants.filter((p) => ids.includes(p.id));
            });
        }
        fetchRecordBlock(isRecord, groupId, movieId, authorId) {
            return __awaiter(this, void 0, void 0, function* () {
                const data = {
                    cmd: 'VideoChatRecordBlock',
                    'st.call.rec': isRecord,
                };
                if (groupId) {
                    data['st.call.gid'] = groupId;
                }
                else if (authorId) {
                    data['st.call.aid'] = authorId;
                }
                if (movieId) {
                    data['st.call.mid'] = movieId;
                }
                const { response } = yield vanillaAjax({
                    url: '/dk',
                    data,
                });
                return response;
            });
        }
        setJoinLink(link) {
            const { call } = this.store.get();
            this.store.set({ call: Object.assign(Object.assign({}, call), { link }) });
        }
        /**
         * videochat/renewJoinLink и videochat/getJoinLink будут генерировать новую ссылку.
         * getJoinLink будет отдавать существующую, если она уже создана.
         *
         * @param renewLink Надо ли нам обновлять ссылку
         * @returns `webapiInvoke` function promise
         */
        getJoinLink(renewLink) {
            const handleGetLinkError = () => {
                const { toaster } = this.store;
                toaster.add({
                    text: l10n('join-link-load-error'),
                });
            };
            const { call } = this.store.get();
            const params = { call_id: call.conversationId };
            if (renewLink) {
                return webapiInvoke('videochat/renewJoinLink', params)
                    .then((result) => {
                    this.setJoinLink(result);
                    return result;
                })
                    .catch(handleGetLinkError);
            }
            return webapiInvoke('videochat/getJoinLink', params)
                .then((result) => {
                this.setJoinLink(result);
                return result;
            })
                .catch(handleGetLinkError);
        }
        addFriendRequest(friendId) {
            const data = {
                cmd: 'MiddleColumnTopCardFriend',
            };
            data['st.cmd'] = 'friendMain';
            data['st.jn.act'] = 'JOIN';
            data['st.jn.id'] = friendId;
            data['st.jn.id'] = friendId;
            data['st.friendId'] = friendId;
            data['st._aid'] = 'FriendTopCard_JoinDropdown_JOIN';
            data['st.vpl.mini'] = false;
            return vanillaAjax({
                url: '/dk',
                data,
            });
        }
        revokeFriendRequest(friendId) {
            const data = {
                cmd: 'MiddleColumnTopCardFriend',
            };
            data['st.cmd'] = 'friendMain';
            data['st.jn.act'] = 'REVOKE';
            data['st.jn.id'] = friendId;
            data['st.jn.id'] = friendId;
            data['st.friendId'] = friendId;
            data['st._aid'] = 'FriendTopCard_JoinDropdown_REVOKE';
            data['st.vpl.mini'] = false;
            return vanillaAjax({
                url: '/dk',
                data,
            });
        }
        subscribeChatMessages(onChatPush) {
            // Если загружен MessagesPushController или не загружены оба
            if (Import.defined('OK/messages/MessagesPushController')) {
                Import.require(['OK/messages/MessagesPushController']).then(([push]) => {
                    this.unsubscribeMessagesPushMethod = push.register({
                        name: 'videoChatLayer',
                        priority: push.priority.low,
                        applyNews: onChatPush,
                    });
                });
            }
            else if (Import.defined('MSG/bootstrap')) {
                Import.require(['MSG/bootstrap']).then(([push]) => {
                    this.unsubscribeMessagesPushMethod = push.pushSubscribe(onChatPush);
                });
            }
        }
        unsubscribeChatMessages() {
            if (this.unsubscribeMessagesPushMethod) {
                this.unsubscribeMessagesPushMethod();
                delete this.unsubscribeMessagesPushMethod;
            }
        }
        setCallInProgress(value) {
            Import.require(['OK/GroupCallPush']).then(([groupCallPush]) => {
                var _a;
                groupCallPush.setCallInProgress(value);
                // Бага активации, чтобы не трогать код портала, костыльнем тут ручном вызовом активации
                const el = (_a = document.getElementById('hook_Block_GroupCallPush')) === null || _a === void 0 ? void 0 : _a.children[0];
                if (el && !value) {
                    // el && groupCallPush.activate(el);
                    el.classList.toggle('__disabled', false);
                    el.classList.toggle('iblock-cloud_show', false);
                }
            });
        }
    }

    const defaultPack = {
        ["call_incoming" /* Sounds.call_incoming */]: 'res/default/sound/videochat/ring.mp3',
        ["call_busy" /* Sounds.call_busy */]: 'res/default/sound/videochat/busy.mp3',
        ["call_olga" /* Sounds.call_olga */]: 'res/default/sound/videochat/olga.mp3',
        ["call_finished" /* Sounds.call_finished */]: 'res/default/sound/videochat/drop.mp3',
        ["call_ringing" /* Sounds.call_ringing */]: 'res/default/sound/videochat/beep.mp3',
        ["call_connecting" /* Sounds.call_connecting */]: 'res/default/sound/videochat/connecting.mp3',
    };
    /**
     * Работа со звуками для ТТ
     */
    class SoundsService {
        /**
         * Инициализация
         */
        constructor(okService) {
            this.okService = okService;
            this.playing = {};
            this.sounds = {};
            this.channels = [new Channel(0), new Channel(1)];
            this.initialized = this.loadPack(defaultPack);
        }
        get isSupportOutputChange() {
            if (typeof this.supportOutputChange !== 'undefined') {
                return this.supportOutputChange;
            }
            const audio = new Audio();
            return (this.supportOutputChange = 'setSinkId' in audio);
        }
        /**
         * Воспроизведение звука
         */
        playSound(name, loop) {
            return __awaiter(this, void 0, void 0, function* () {
                // Не играем один звук дважды
                if (name in this.playing) {
                    return;
                }
                yield this.initialized;
                const url = this.sounds[name];
                const [channelA, channelB] = this.channels;
                // TODO: Легко можно сделать циклом по N каналов
                // для простоты пока оставим так, прямыми вызовами
                const callback = () => {
                    delete this.playing[name];
                };
                if (!channelA.playing) {
                    // Записываем урл играемого обьекта
                    this.playing[name] = channelA.num;
                    channelA.play(url, loop);
                    channelA.onEnded = callback;
                    return;
                }
                if (!channelB.playing) {
                    this.playing[name] = channelA.num;
                    channelB.play(url, loop);
                    channelA.onEnded = callback;
                    return;
                }
            });
        }
        /**
         * Отключить проигрывание вручную, например для зацикливаний музыки
         */
        stopSound(name) {
            return __awaiter(this, void 0, void 0, function* () {
                const num = this.playing[name];
                yield this.initialized;
                // Не стопим один звук дважды
                if (typeof num === 'undefined') {
                    return;
                }
                this.channels[num].stop();
                delete this.playing[name];
            });
        }
        /**
         * Остановить воспроизведение всех звуков
         */
        stopAll() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.initialized;
                this.playing = {};
                this.channels.forEach((ch) => ch.stop());
            });
        }
        /**
         * Настройка мастер уровня громкости
         * @param level [0..1]
         */
        masterVolume(level) {
            this.channels.forEach((channel) => channel.volume(level));
        }
        /**
         * Настройка вывода звуков на устройство по id
         */
        masterOutput(deviceId) {
            if (this.supportOutputChange) {
                this.channels.forEach((channel) => channel.output(deviceId));
            }
        }
        /**
         * Blob музыки по имени
         */
        getSound(name) {
            return this.sounds[name];
        }
        /**
         * Замена музыки на другую в текущем паке (для промо например)
         */
        replacePackSound(sounds) {
            const customPack = Object.assign({}, defaultPack);
            sounds.forEach((item) => {
                customPack[item.sound] = item.url;
            });
            this.initialized = this.loadPack(customPack);
        }
        /**
         * Загружаем звуковой пак для воспроизведения
         */
        loadPack(pack) {
            return __awaiter(this, void 0, void 0, function* () {
                const requests = [];
                // Размонитруем старый пак
                Object.keys(this.sounds).forEach((name) => {
                    // @ts-expect-error TS2345: Argument of type 'string | undefined' is not assignable to parameter of type 'string'
                    URL.revokeObjectURL(this.sounds[name]);
                });
                // Монтируем новый
                Object.keys(pack).forEach((name) => {
                    const url = `${this.okService.getStatic()}${pack[name]}`;
                    requests.push(fetch(url)
                        .then((res) => res.blob())
                        .then((blob) => {
                        this.sounds[name] = URL.createObjectURL(blob);
                    })
                        .catch((e) => console.log(e)));
                });
                return Promise.all(requests);
            });
        }
    }
    class Channel {
        constructor(num) {
            this.num = num;
            this.audio = new Audio();
            this.sourceElement = document.createElement('source');
            this.audio.appendChild(this.sourceElement);
            this.sourceElement.type = 'audio/mp3';
            this.audio.preload = 'auto';
            this.audio.autoplay = false;
            this.audio.addEventListener('onstalled', () => this.audio.load());
        }
        get playing() {
            return !this.audio.paused;
        }
        get playungUrl() {
            return this.audio.src;
        }
        set onEnded(callback) {
            this.audio.onended = callback;
            this.audio.onstalled = callback;
            this.audio.onerror = callback;
            this.audio.onpause = callback;
        }
        play(url, loop) {
            this.setSrc(url);
            this.audio.currentTime = 0;
            this.audio.loop = !!loop;
            this.audio.play();
        }
        stop() {
            this.audio.pause();
            this.audio.onended = null;
            this.audio.onstalled = null;
            this.audio.onerror = null;
            this.audio.onpause = null;
        }
        volume(level) {
            this.audio.volume = level;
        }
        output(deviceId) {
            // @ts-ignore
            this.audio.setSinkId(deviceId);
        }
        setSrc(url) {
            if (this.sourceElement.src !== url) {
                this.sourceElement.src = url;
                this.audio.load();
            }
        }
    }

    class CallsStore extends Store {
        constructor(data, callParams) {
            super(data);
            this.l10n = l10n;
            this.ok = new OKService(this);
            this.sounds = new SoundsService(this.ok);
            this.toaster = new ToastService(this);
            this.logger = new Logger(callParams === null || callParams === void 0 ? void 0 : callParams.stat);
            this.call = new CallService(this, callParams === null || callParams === void 0 ? void 0 : callParams.initialParams);
            this.set({
                cachedParticipants: new Map(),
                controls: { newMessagesCount: 0 },
                expanded: data.expanded !== false,
                features: callParams === null || callParams === void 0 ? void 0 : callParams.features,
                initialParams: callParams === null || callParams === void 0 ? void 0 : callParams.initialParams,
                l10n,
                settings: storageSettings.get(),
                speakers: new Map(),
                speakersInHeader: [],
            });
        }
        updatePromo(params) {
            if (params) {
                this.set({ promo: params });
                const sounds = [];
                if (params.soundCalling) {
                    sounds.push({ sound: "call_ringing" /* Sounds.call_ringing */, url: params.soundCalling });
                }
                if (params.soundIncoming) {
                    sounds.push({ sound: "call_incoming" /* Sounds.call_incoming */, url: params.soundIncoming });
                }
                if (sounds.length) {
                    this.sounds.replacePackSound(sounds);
                }
            }
        }
        /**
         * Переключение режима развернутости звонка
         */
        toggleExpanded(value = !this.get().expanded) {
            this.logger.log("callUiAction" /* Stat.UI_ACTION */, value ? 'maximize' : 'minimize');
            this.set({ expanded: value });
        }
    }

    /**
     * Возвращает индекс цвета по id сущности
     * @param value id сущности
     * @return индекс цвета
     */
    function getColorIndex(value) {
        return (Math.abs(value) >>> 8) % 16;
    }
    /**
     * Возвращает текст для заглушки с инициалами
     */
    function getInitials(text) {
        if (text && text.length > 0) {
            // const lettersDigitsAndSpaces = text.replace(/[^A-Za-zА-Яа-я0-9 ]+/gm, '');
            const lettersDigitsAndSpaces = text.replace(/["'.\\[\]{}`,:;//(/)<>]+/gm, '');
            if (lettersDigitsAndSpaces && lettersDigitsAndSpaces.trim().length > 0) {
                text = lettersDigitsAndSpaces;
            }
            const split = text.trim().split(/\s+/).slice(0, 2);
            const result = [];
            split.some((s) => {
                const ch = s.charAt(0);
                if (isHighSurrogate(ch)) {
                    result.push(s.substring(0, 2));
                    return true;
                }
                else {
                    result.push(s.substring(0, 1));
                }
            });
            return result;
        }
        return [''];
    }
    function isHighSurrogate(ch) {
        return ch >= '\uD800' && ch <= '\uDBFF';
    }

    var colors = [
    	"#E0026D",
    	"#E15C4A",
    	"#FD7E16",
    	"#F69627",
    	"#E12D63",
    	"#DE557E",
    	"#E14FDA",
    	"#BD328E",
    	"#348DE1",
    	"#9548E1",
    	"#364AE1",
    	"#5C6EE1",
    	"#00A9CE",
    	"#32BD6A",
    	"#319BDD",
    	"#3294BD"
    ];

    /**
     * Same as `emit` but doesn’t bubble up event. A convenience for notifying component
     * subscribers only.
     */
    function notify(elem, type, detail) {
        elem.dispatchEvent(new CustomEvent(type, {
            bubbles: false,
            cancelable: false,
            detail
        }));
        return elem;
    }

    const emptyGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const queue = new Set();
    let timer = null;
    /** Номер попытки проверки доступности сети */
    let attempt = 0;
    /** Максимальное значение попыток, от которого высчитывать таймер */
    const maxAttempts = 4;
    /** URL, который надо запрашивать для определения наличия сети */
    let url;
    /**
     * Вызовет функцию `callback`, когда браузер подключится к сети. По возможности
     * использует браузерный API для определения наличия подключения, но он не очень
     * надёжный: например, у нас может быть подключение к роутеру, но отсутствовать
     * фактическое подключение к сети. Поэтому действуем по следующему алгоритму:
     * — проверяем `navigator.onLine`: если `false`, то ждём события `online`
     * – если `navigator.onLine` отличается от `false`, будем пинговать URL
     * с прогрессивным таймаутом до тех пор, пока не получим положительный ответ
     */
    function waitOnline(callback) {
        if (navigator.onLine === false) {
            // NB: по спеке одну и ту же функцию можно вешать на событие сколько угодно
            // раз, она повесится только один раз
            window.addEventListener('online', callback);
        }
        else {
            queue.add(callback);
            if (timer === null) {
                poll();
            }
        }
        return () => disposeWaitOnline(callback);
    }
    /**
     * Удаляет указанный `callback` из очереди ожидания на появление сети
     */
    function disposeWaitOnline(callback) {
        window.removeEventListener('online', callback);
        queue.delete(callback);
        if (queue.size === 0) {
            cancelTimeout();
        }
    }
    /**
     * Endorphin-директива, которая проверяет, загрузилось ли изображение у указанного
     * элемента и если нет, выполняет догрузку, когда появится сеть
     */
    function imageOnline(img, src) {
        let curSrc;
        let attempt = 0;
        let onOnline = null;
        // Запишем урл как ссылку для опроса
        url = src;
        const unbindEvents = () => {
            img.removeEventListener('load', onLoad);
            img.removeEventListener('error', onError);
        };
        const setSrc = (src) => {
            const nextSrc = src;
            if (nextSrc !== curSrc) {
                curSrc = nextSrc;
                img.addEventListener('load', onLoad);
                img.addEventListener('error', onError);
                img.src = curSrc || emptyGif;
            }
        };
        const update = () => {
            if (onOnline !== null) {
                onOnline();
                onOnline = null;
            }
            setSrc(src);
        };
        const onLoad = () => {
            if (curSrc !== emptyGif) {
                attempt = 0;
                unbindEvents();
                // Кинем событие, что нужная картинка успешно загрузилась
                notify(img, 'load-success');
            }
        };
        const onError = () => {
            // В большинстве случаев мы полагаем, что картинка всегда должна быть, поэтому
            // если не удалось её загрузить, то с 99% вероятностью из-за того, что нет
            // интернета. Для остальных 1% случаев, когда всё-таки может отсутствовать картинка,
            // будем использовать счётчик попыток
            if (onOnline === null && attempt < 4) {
                attempt++;
                onOnline = waitOnline(update);
                setSrc(emptyGif);
            }
        };
        update();
        return {
            update(nextSrc) {
                src = nextSrc;
                attempt = 0;
                if (onOnline === null) {
                    // Если не ждём появления сети, сразу обновляем картинку
                    setSrc(src);
                }
            },
            destroy() {
                if (onOnline !== null) {
                    onOnline();
                    onOnline = null;
                }
                unbindEvents();
            },
        };
    }
    function poll() {
        cancelTimeout();
        timer = window.setTimeout(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const pollUrl = randomize(url);
                const res = yield fetch(pollUrl, { credentials: 'include' });
                yield res.json();
                // Если всё отработало, сеть есть, сообщаем подписчикам
                attempt = 0;
                const callbacks = Array.from(queue);
                cancelTimeout();
                queue.clear();
                callbacks.forEach((fn) => fn());
            }
            catch (err) {
                cancelTimeout();
                if (queue.size) {
                    poll();
                }
            }
        }), createTimeout(attempt++));
    }
    function createTimeout(attempt) {
        return (Math.pow(2, Math.min(attempt, maxAttempts)) + Math.random()) * 1000;
    }
    function cancelTimeout() {
        window.clearTimeout(timer);
        timer = null;
    }
    function randomize(url) {
        const glue = url.indexOf('?') === -1 ? '?' : '&';
        return `${url}${glue}_=${Math.random()}`;
    }

    function props$2() {
        return {
            id: 0,
            caption: '',
            size: 'medium',
            url: '',
        };
    }
    function willMount$2(component) {
        updateBackgroundColor(component);
    }
    function didChange$3(component, { caption }) {
        if (caption) {
            // TODO: PTS нужно
            // const initials = getInitials(caption.current || component.store.l10n('empty-chat-placeholder'));
            const initials = caption.current ? getInitials(caption.current) : [];
            component.setState({
                initials: initials.join(''),
                emojiOnly: isSingleEmoji(initials),
            });
        }
        updateBackgroundColor(component);
    }
    function updateBackgroundColor(component) {
        const { id, url } = component.props;
        component.style.backgroundColor = id && !url ? colors[getColorIndex(id)] : '';
    }
    /**
     * Проверяем, состоит ли заглушка названия из единственного эмодзи
     * Это влияет на оформление
     */
    function isSingleEmoji(initials) {
        return initials.length === 1 && initials[0].length === 2;
    }

    const cssScope$5 = "e7bc93l";

    function spanAttrs$0(elem, prev, host) {
    	updateClass(elem, prev, (host.state.emojiOnly ? "large" : ""));
    }

    function ifBody$0$1(host, injector, scope) {
    	const _4 = scope._4 = insert(injector, elem("span", cssScope$5));
    	const _5 = scope._5 = obj();
    	spanAttrs$0(_4, _5, host);
    	scope._6 = appendChild(_4, text(host.state.initials));
    	return ifBody$0Update;
    }

    ifBody$0$1.dispose = ifBody$0Unmount;

    function ifBody$0Update(host, scope) {
    	spanAttrs$0(scope._4, scope._5, host);
    	updateText(scope._6, host.state.initials);
    }

    function ifBody$0Unmount(scope) {
    	scope._5 = scope._6 = scope._4 = null;
    }

    function ifEntry$0$1(host) {
    	return !host.props.url ? ifBody$0$1 : null;
    }

    function imgAttrs$0(elem, prev, host) {
    	updateAttribute(elem, prev, "src", host.props.url);
    }

    function ifBody$1(host, injector, scope) {
    	const _b = scope._b = insert(injector, elem("img", cssScope$5));
    	const _c = scope._c = obj();
    	imgAttrs$0(_b, _c, host);
    	scope._d = mountUse(host, _b, imageOnline, host.props.url);
    	return ifBody$1Update;
    }

    ifBody$1.dispose = ifBody$1Unmount;

    function ifBody$1Update(host, scope) {
    	imgAttrs$0(scope._b, scope._c, host);
    	updateUse(scope._d, host.props.url);
    }

    function ifBody$1Unmount(scope) {
    	scope._d = unmountUse(scope._d);
    	scope._c = scope._b = null;
    }

    function ifEntry$1(host) {
    	return host.props.url ? ifBody$1 : null;
    }

    function template$0$5(host, scope) {
    	const _0 = host.componentView;
    	const _7 = createInjector(_0);
    	scope._1 = mountBlock(host, _7, ifEntry$0$1);
    	scope._8 = mountBlock(host, _7, ifEntry$1);
    	return template$0Update$4;
    }

    template$0$5.dispose = template$0Unmount$4;

    function template$0Update$4(host, scope) {
    	updateBlock(scope._1);
    	updateBlock(scope._8);
    }

    function template$0Unmount$4(scope) {
    	scope._1 = clearBlock(scope._1);
    	scope._8 = clearBlock(scope._8);
    }

    var MsgAvatar = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope$5,
        'default': template$0$5,
        imageOnline: imageOnline,
        props: props$2,
        willMount: willMount$2,
        didChange: didChange$3
    });

    const props$1 = () => ({
        active: false,
        disabled: false,
        role: 'primary',
        size: 'large',
        shape: 'circle',
    });

    const cssScope$4 = "e86zfpn";

    function template$0$4(host, scope) {
    	const _0 = host.componentView;
    	appendChild(_0, createSlot(host, "", cssScope$4));
    	scope._2 = mountSlot(host, "");
    }

    template$0$4.dispose = template$0Unmount$3;

    function template$0Unmount$3(scope) {
    	scope._2 = unmountSlot(scope._2);
    }

    var MsgButton = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope$4,
        'default': template$0$4,
        props: props$1
    });

    var iconList = ["add-user-large","add-user","air","arrow-down-large","arrow-down","arrow-left-large","arrow-left","arrow-right-large","arrow-right","arrow-up-large","arrow-up","call-hangup-large","call-hangup","camera","cat","check","clear","close-bold","close-circle","close-large","close","collapse-large","collapse","connection","copy","done","download-log","expand-large","expand","fullscreen-off-large","fullscreen-off","fullscreen-on-large","fullscreen-on","help","info-circle","invisible","live","message-large","message-new","message-off-large","message-small","message","microphone-large","microphone-off-colorfilled","microphone-off-large","microphone-off","microphone-small","microphone","more-vertical","ok-logo-small","phone-large","phone-small","phone","pin-large","pin","progress","rec","recall-large","repeat","screen-share","screen-sharing-on","screensharing-off-large","screensharing-off","screensharing-on-large","screensharing-on","search","settings-large","settings","share","star-large","url-large","url","user-add","user-large","user-square","user","video-large","video-off-large","video-off","video-small","video","videocam-off","view-carousel-large","view-carousel","view-grid-large","view-grid"];

    // @ts-expect-error Подставляется при сборке, смотри `tools/build/bundle-hash.js`
    /**
     * Маппинг названий иконок
     */
    const mapping = {
        close: 'clear',
        showRead: 'looked',
        'canceled-audio-call': 'outgoing-audio-call',
        'canceled-video-call': 'outgoing-video-call',
        'media-share': 'link',
        'media-file': 'file',
        'media-audio': 'microphone',
        replay: 'undo',
        report: 'complaint',
        'session-desktop': 'desktop',
        locationStop: 'location-stop',
        privateReply: 'private-reply',
    };
    /** Кэш загруженных иконок */
    const iconCache = {};
    /** Список загружаемых иконок */
    const iconLoaders = {};
    /** Подписчики, ожидающие загрузки иконок */
    const listeners = [];
    /** Ссылки на иконки, */
    const onlineQueue = [];
    function state() {
        return {
            icon: null,
            _attempt: 0,
            _listener: null,
        };
    }
    function didChange$2(component, { icon, size }) {
        if (icon || size) {
            component.state._attempt = 0;
            if (icon && !icon.current) {
                setIcon(component, null);
            }
            else {
                const nextIcon = getIconName(component);
                if (nextIcon && nextIcon in iconCache) {
                    // Уже есть загруженная иконка, сразу покажем её
                    setIcon(component, nextIcon);
                }
                else if (nextIcon) {
                    // Ещё нет данных по иконкам, загрузим
                    loadIcon(component, nextIcon);
                }
            }
        }
    }
    function willUnmount$1(component) {
        disposeListener(component);
    }
    /**
     * Загружает указанную иконку с сервера
     */
    function loadIcon(component, icon) {
        const { state } = component;
        if (!state._listener && state._attempt < 4) {
            state._attempt++;
            state._listener = () => {
                // В подписчике проверяем, что именно текущая иконка загрузилась,
                // так как она может поменяться
                const _icon = getIconName(component);
                if (!_icon || iconCache[_icon]) {
                    setIcon(component, _icon);
                }
                component.state._attempt = 0;
            };
            listeners.push(state._listener);
        }
        if (!iconLoaders[icon]) {
            fetchIcon(icon, getUrl(component, icon));
        }
    }
    function setIcon(component, icon) {
        let _icon = icon && iconCache[icon];
        if (_icon) {
            _icon = _icon.cloneNode(true);
        }
        component.setState({ icon: _icon });
        disposeListener(component);
    }
    function getUrl(component, icon) {
        return `${component.store.get().staticRoot}/assets/icons/${getFileName(icon)}.svg`;
    }
    function getFileName(icon) {
        return iconList.find((filename) => filename.startsWith(`${icon}_`)) || icon;
    }
    function getIconName(component) {
        const { icon, size } = component.props;
        if (!icon) {
            return null;
        }
        const name = mapping[icon] || icon;
        const suffix = size === 'small' || size === 'large' ? `-${size}` : '';
        return iconList.some((filename) => filename.startsWith(name + suffix)) ? name + suffix : name;
    }
    function parseHTML(html) {
        const div = document.createElement('div');
        const df = document.createDocumentFragment();
        div.innerHTML = html.trim();
        while (div.firstChild) {
            df.appendChild(div.firstChild);
        }
        return df;
    }
    function fetchIcon(icon, url) {
        return (iconLoaders[icon] = request(url)
            .then((src) => {
            iconCache[icon] = parseHTML(src);
            iconLoaders[icon] = null;
            // Оповещаем всех подписчиков, что иконка загрузилась
            listeners.slice().forEach((l) => l());
            return src;
        })
            .catch((err) => {
            console.warn(err);
            iconLoaders[icon] = null;
            queueUntilOnline(icon, url);
            throw err;
        }));
    }
    function disposeListener(component) {
        const { state } = component;
        if (state._listener) {
            const ix = listeners.indexOf(state._listener);
            if (ix !== -1) {
                listeners.splice(ix, 1);
            }
            state._listener = null;
        }
    }
    function request(url) {
        return fetch(url, { mode: 'cors' }).then((res) => res.text());
    }
    function queueUntilOnline(icon, url) {
        if (!onlineQueue.some((entry) => entry.icon === icon)) {
            onlineQueue.push({ icon, url });
            if (onlineQueue.length === 1) {
                waitOnline(flushOnlineQueue);
            }
        }
    }
    function flushOnlineQueue() {
        const queue = onlineQueue.slice();
        onlineQueue.length = 0;
        queue.forEach((entry) => {
            if (!iconLoaders[entry.icon]) {
                fetchIcon(entry.icon, entry.url);
            }
        });
    }

    const cssScope$3 = "e-ryzee3";

    function html$0$1(host) {
    	return host.state.icon;
    }

    function template$0$3(host, scope) {
    	const _0 = host.componentView;
    	const _2 = createInjector(_0);
    	scope._1 = mountInnerHTML(host, _2, html$0$1);
    	return template$0Update$3;
    }

    template$0$3.dispose = template$0Unmount$2;

    function template$0Update$3(host, scope) {
    	updateInnerHTML(scope._1);
    }

    function template$0Unmount$2(scope) {
    	scope._1 = clearInnerHTML(scope._1);
    }

    var MsgIcon = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope$3,
        'default': template$0$3,
        state: state,
        didChange: didChange$2,
        willUnmount: willUnmount$1
    });

    function props() {
        return { key: '' };
    }
    const updatePtsParams = (component) => {
        const { props } = component;
        const ptsParams = Object.keys(props).reduce((out, prop) => {
            if (prop !== 'key') {
                out[prop] = props[prop];
            }
            return out;
        }, {});
        component.setState({ ptsParams });
    };
    function willMount$1(component) {
        updatePtsParams(component);
    }
    function didChange$1(component) {
        updatePtsParams(component);
    }

    const cssScope$2 = "e-ut4tbr";

    function html$0(host) {
    	return host.store.data.l10n(host.props.key, host.state.ptsParams);
    }

    function template$0$2(host, scope) {
    	const _0 = host.componentView;
    	const _2 = createInjector(_0);
    	scope._1 = mountInnerHTML(host, _2, html$0);
    	subscribeStore(host, ["l10n"]);
    	return template$0Update$2;
    }

    template$0$2.dispose = template$0Unmount$1;

    function template$0Update$2(host, scope) {
    	updateInnerHTML(scope._1);
    }

    function template$0Unmount$1(scope) {
    	scope._1 = clearInnerHTML(scope._1);
    }

    var MsgL10n = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope$2,
        'default': template$0$2,
        props: props,
        willMount: willMount$1,
        didChange: didChange$1
    });

    const MS_IN_SECOND = 1000;
    const SECONDS_IN_MINUTE = 60;
    const MINUTES_IN_HOURS = 60;
    const SECONDS_IN_HOURS = 3600;
    function didChange(component) {
        const { duration } = component.props;
        component.setState({
            duration: formatDuration(duration || 0),
        });
    }
    function formatDuration(timeInMs) {
        const secondsInMS = Math.floor(timeInMs / MS_IN_SECOND);
        const hours = Math.floor(secondsInMS / SECONDS_IN_HOURS);
        const minutes = Math.floor((secondsInMS % SECONDS_IN_HOURS) / MINUTES_IN_HOURS);
        const seconds = Math.floor(secondsInMS % SECONDS_IN_MINUTE);
        const resultHours = hours !== 0 ? `${hours}:` : '';
        return `${resultHours}${pad(minutes)}:${pad(seconds)}`;
    }
    function pad(num) {
        return num < 10 ? `0${num}` : String(num);
    }

    const cssScope$1 = "e-pz3zmp";

    function template$0$1(host, scope) {
    	const _0 = host.componentView;
    	scope._1 = appendChild(_0, text(host.state.duration));
    	return template$0Update$1;
    }

    function template$0Update$1(host, scope) {
    	updateText(scope._1, host.state.duration);
    }

    var MsgDuration = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope$1,
        'default': template$0$1,
        didChange: didChange
    });

    /**
     * Класс, обеспечивающий обновление указанного списка элементов по таймеру.
     * Используется для того, чтобы не создавать на каждый элемент по отдельному
     * таймеру, а использовать один
     */
    class TimeUpdater {
        /**
         * Интервал в миллисекундах, через который нужно обновлять элементы
         */
        constructor(updateFn, updateInterval = 30000) {
            this.updateFn = updateFn;
            this.updateInterval = updateInterval;
            this.elems = new Set();
            this._update = this._update.bind(this, this._update);
        }
        /**
         * Добавляет элемент в список обновления
         */
        add(elem) {
            this.elems.add(elem);
            this._startTimer();
        }
        /**
         * Удаляет элемент из списка обновления
         */
        remove(elem) {
            if (this.elems.has(elem)) {
                this.elems.delete(elem);
            }
            if (!this.elems.size) {
                clearTimeout(this.timer);
                this.timer = null;
            }
        }
        /**
         * Запуск таймера обновления
         */
        _startTimer() {
            if (!this.timer && this.elems.size) {
                this.timer = window.setTimeout(this._update, this.updateInterval);
            }
        }
        /**
         * Обновление элементов из списка
         */
        _update() {
            const now = Date.now();
            this.timer = null;
            this.elems.forEach((elem) => this.updateFn(elem, now));
            this._startTimer();
        }
    }

    const updater = new TimeUpdater(updateCallDuration, 1000);
    const extend = {
        isCallEnded,
    };
    function willMount(component) {
        updater.add(component);
        updateCallDuration(component);
        const clearResetTimeout = () => {
            if (component.resetTimeout) {
                window.clearTimeout(component.resetTimeout);
                component.resetTimeout = undefined;
            }
        };
        component.store.subscribe((state, changes) => {
            var _a;
            const { prev, current } = (_a = changes.$call) !== null && _a !== void 0 ? _a : {};
            if (!current || !prev || prev.state === current.state) {
                return;
            }
            if (isCallEnded(current)) {
                component.resetTimeout = window.setTimeout(() => {
                    component.store.set({ call: Object.assign(Object.assign({}, component.store.get().call), { state: undefined }) });
                }, 3000);
                updater.remove(component);
            }
            else if (current.state === "outgoing" /* CallState.Outgoing */) {
                clearResetTimeout();
                component.setState({ duration: 0 });
            }
            else if (current.state === "active" /* CallState.Active */) {
                clearResetTimeout();
                updater.add(component);
                updateCallDuration(component);
            }
        }, ['call']);
    }
    function willUnmount(component) {
        updater.remove(component);
    }
    function onToggleCallState(component) {
        const { call } = component.store.get();
        if (!call) {
            return;
        }
        if (call.state === "outgoing" /* CallState.Outgoing */ || call.state === "active" /* CallState.Active */) {
            component.store.call.hangup();
        }
        else {
            component.store.call.start(call.opponent.id, call.opponent.type);
        }
    }
    /**
     * Обновление метки с временем звонка
     */
    function updateCallDuration(component) {
        const { call } = component.store.get();
        let duration = 0;
        if (call && call.startTime) {
            duration = Date.now() - call.startTime;
        }
        component.setState({ duration });
    }

    const cssScope = "ea1ieif";
    let __isWaitingAnswer, __isActive, __isEnded, __calling;

    function setVars$0(host) {
    	__isWaitingAnswer = (get(host.store.data.call, "state") === "outgoing");
    	__isActive = (get(host.store.data.call, "state") === "active");
    	__isEnded = call(host, "isCallEnded", [host.store.data.call]);
    	__calling = undefined;
    }

    function msgAvatarAttrs$0(elem, prev, host) {
    	prev.url = get(host.store.data.call, "opponent", "avatar");
    }

    function chooseBody$0(host, injector, scope) {
    	const _f = insert(injector, elem("div", cssScope));
    	const _g = scope._g = appendChild(_f, createComponent("msg-l10n", MsgL10n, host));
    	mountComponent(_g, propsSet(_g, {key: "wait.answer"}));
    }

    chooseBody$0.dispose = chooseBody$0Unmount;

    function chooseBody$0Unmount(scope) {
    	scope._g = unmountComponent(scope._g);
    }

    function msgDurationAttrs$0(elem, prev, host) {
    	prev.duration = host.state.duration;
    }

    function chooseBody$1(host, injector, scope) {
    	const _k = insert(injector, elem("div", cssScope));
    	setClass(_k, "current-call");
    	const _l = scope._l = appendChild(_k, createComponent("msg-l10n", MsgL10n, host));
    	mountComponent(_l, propsSet(_l, {key: "msg-call"}));
    	const _n = scope._n = insert(injector, createComponent("msg-duration", MsgDuration, host));
    	const _o = scope._o = propsSet(_n, {"data-tsid": "call-duration", class: "duration"});
    	msgDurationAttrs$0(_n, _o, host);
    	mountComponent(_n, _o);
    	return chooseBody$1Update;
    }

    chooseBody$1.dispose = chooseBody$1Unmount;

    function chooseBody$1Update(host, scope) {
    	const { _n, _o } = scope;
    	msgDurationAttrs$0(_n, _o, host);
    	updateComponent(_n, _o);
    }

    function chooseBody$1Unmount(scope) {
    	scope._l = unmountComponent(scope._l);
    	scope._n = unmountComponent(scope._n);
    	scope._o = null;
    }

    function msgDurationAttrs$1(elem, prev, host) {
    	prev.duration = host.state.duration;
    }

    function chooseBody$2(host, injector, scope) {
    	const _r = insert(injector, elem("div", cssScope));
    	setClass(_r, "call-finished");
    	const _s = scope._s = appendChild(_r, createComponent("msg-l10n", MsgL10n, host));
    	mountComponent(_s, propsSet(_s, {key: "call.finished"}));
    	const _u = scope._u = insert(injector, createComponent("msg-duration", MsgDuration, host));
    	const _v = scope._v = propsSet(_u, {"data-tsid": "call-duration", class: "duration"});
    	msgDurationAttrs$1(_u, _v, host);
    	mountComponent(_u, _v);
    	return chooseBody$2Update;
    }

    chooseBody$2.dispose = chooseBody$2Unmount;

    function chooseBody$2Update(host, scope) {
    	const { _u, _v } = scope;
    	msgDurationAttrs$1(_u, _v, host);
    	updateComponent(_u, _v);
    }

    function chooseBody$2Unmount(scope) {
    	scope._s = unmountComponent(scope._s);
    	scope._u = unmountComponent(scope._u);
    	scope._v = null;
    }

    function chooseBody$3(host, injector, scope) {
    	const _y = insert(injector, elem("div", cssScope));
    	setClass(_y, "title");
    	const _z = scope._z = appendChild(_y, createComponent("msg-l10n", MsgL10n, host));
    	mountComponent(_z, propsSet(_z, {key: "title"}));
    	const _11 = insert(injector, elem("div", cssScope));
    	setClass(_11, "status");
    	const _12 = scope._12 = appendChild(_11, createComponent("msg-l10n", MsgL10n, host));
    	mountComponent(_12, propsSet(_12, {key: "status.online"}));
    }

    chooseBody$3.dispose = chooseBody$3Unmount;

    function chooseBody$3Unmount(scope) {
    	scope._z = unmountComponent(scope._z);
    	scope._12 = unmountComponent(scope._12);
    }

    function chooseEntry$0() {
    	return __isWaitingAnswer ? chooseBody$0 : __isActive ? chooseBody$1 : __isEnded ? chooseBody$2 : chooseBody$3;
    }

    function ifBody$0(host, injector) {
    	const _19 = insert(injector, elem("div", cssScope));
    	setClass(_19, "decor");
    	const _1a = insert(injector, elem("div", cssScope));
    	setClass(_1a, "decor __2");
    }

    function ifEntry$0() {
    	return __isWaitingAnswer ? ifBody$0 : null;
    }

    function msgButtonAttrs$0(elem, prev) {
    	prev.role = (__calling ? "distraction" : "primary");
    	prev.active = !__calling;
    	prev.class = (__isWaitingAnswer ? "__calling" : "");
    }

    function msgIconAttrs$0(elem, prev) {
    	prev.icon = ((__isWaitingAnswer || __isActive) ? "call-hangup" : "phone");
    }

    function template$0(host, scope) {
    	const _0 = host.componentView;
    	setVars$0(host);
    	const _6 = appendChild(_0, elem("div", cssScope));
    	setAttribute(_6, "data-tsid", "call-avatar-wrapper");
    	setClass(_6, "avatar");
    	const _7 = scope._7 = appendChild(_6, createComponent("msg-avatar", MsgAvatar, host));
    	const _8 = scope._8 = propsSet(_7, {"data-tsid": "call-avatar", size: "large"});
    	msgAvatarAttrs$0(_7, _8, host);
    	mountComponent(_7, _8);
    	const _9 = scope._9 = appendChild(_6, createComponent("msg-icon", MsgIcon, host));
    	mountComponent(_9, propsSet(_9, {size: "small", class: "logo", icon: "ok-logo"}));
    	const _b = appendChild(_0, elem("div", cssScope));
    	const _14 = createInjector(_b);
    	setClass(_b, "info");
    	scope._c = mountBlock(host, _14, chooseEntry$0);
    	const _15 = appendChild(_0, elem("div", cssScope));
    	const _1b = createInjector(_15);
    	setAttribute(_15, "data-tsid", "call-app-widget_call-block");
    	setClass(_15, "call");
    	scope._16 = mountBlock(host, _1b, ifEntry$0);
    	const _1c = scope._1c = insert(_1b, createComponent("msg-button", MsgButton, host));
    	const _1h = _1c.componentModel.input;
    	const _1d = scope._1d = propsSet(_1c, {size: "large", shape: "circle"});
    	msgButtonAttrs$0(_1c, _1d);
    	scope._1e = addEvent(_1c, "click", onToggleCallState, host, scope);
    	const _1f = scope._1f = insert(_1h, createComponent("msg-icon", MsgIcon, host), "");
    	const _1g = scope._1g = propsSet(_1f, {size: "large"});
    	msgIconAttrs$0(_1f, _1g);
    	mountComponent(_1f, _1g);
    	mountComponent(_1c, _1d);
    	subscribeStore(host, ["call"]);
    	return template$0Update;
    }

    template$0.dispose = template$0Unmount;

    function template$0Update(host, scope) {
    	const { _7, _8, _1c, _1d, _1f, _1g } = scope;
    	setVars$0(host);
    	msgAvatarAttrs$0(_7, _8, host);
    	updateComponent(_7, _8);
    	updateBlock(scope._c);
    	updateBlock(scope._16);
    	msgButtonAttrs$0(_1c, _1d);
    	msgIconAttrs$0(_1f, _1g);
    	updateComponent(_1f, _1g);
    	updateComponent(_1c, _1d);
    }

    function template$0Unmount(scope) {
    	scope._7 = unmountComponent(scope._7);
    	scope._9 = unmountComponent(scope._9);
    	scope._c = unmountBlock(scope._c);
    	scope._16 = unmountBlock(scope._16);
    	scope._1e = removeEvent("click", scope._1e);
    	scope._1f = unmountComponent(scope._1f);
    	scope._1c = unmountComponent(scope._1c);
    }

    var AppUI = /*#__PURE__*/Object.freeze({
        __proto__: null,
        cssScope: cssScope,
        'default': template$0,
        extend: extend,
        willMount: willMount,
        willUnmount: willUnmount,
        onToggleCallState: onToggleCallState
    });

    /**
     * Загружает указанный CSS-файл на страницу
     * @param target Контейнер, в который нужно монтировать CSS
     * @param css Путь к CSS-файлу
     */
    function loadCSS(target, url) {
        return new Promise((resolve, reject) => {
            let link = document.querySelector(`[href="${url}"][rel="stylesheet"]`);
            if (link) {
                // css уже добавлен
                resolve(link);
            }
            else {
                link = createLink('stylesheet', url);
                let timeout = null;
                const fail = (msg) => {
                    var _a;
                    window.clearTimeout(timeout);
                    (_a = link.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(link);
                    reject(new Error(msg));
                };
                timeout = window.setTimeout(fail, 30000, 'css-timeout');
                link.addEventListener('load', () => {
                    window.clearTimeout(timeout);
                    resolve(link);
                });
                link.addEventListener('error', (e) => {
                    console.log(e);
                    fail('css-fail');
                });
                (target.nodeType !== 1 ? target : document.head).appendChild(link);
            }
        });
    }
    /**
     * Создать ссылку для монтирования css статики
     */
    function createLink(rel, href) {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = href;
        return link;
    }

    let app = null;
    let store = null;
    /**
     * Запуск леера звонков
     */
    function bootstrap(staticRoot) {
        // trail slashes
        staticRoot = staticRoot.replace(/^(.+?)\/*?$/, '$1');
        if (!app) {
            loadCSS(document.head, `${staticRoot}/app-widget.css`);
        }
        return {
            mountEmbed() {
                return __awaiter(this, void 0, void 0, function* () {
                    const target = document.body;
                    const data = getJSONFromComments('#hook_Block_VideoChatEmbedCall');
                    // XXX Заполняем обьект звонка теми данными которые уже есть
                    const conversation = {
                        endpoint: '',
                        conversationId: '',
                        userId: data.userId,
                        iceServers: [],
                        entityType: Ke.GROUP,
                        opponentId: data.groupId,
                        video: data.hasVideo,
                        direction: Je.OUTGOING,
                        concurrent: false,
                        widget: true,
                    };
                    // XXX Заполняем данными об участниках на текущий момент мы уже знаем что это группа и пользователь
                    const participants = [
                        {
                            id: data.userId,
                            local: true,
                            type: z$1.USER,
                        },
                        {
                            id: data.groupId,
                            local: false,
                            type: z$1.GROUP,
                            avatar: data.groupAvatar,
                        },
                    ];
                    store = createStore(staticRoot);
                    yield store.call.initialized;
                    yield store.call.storeOKData(conversation, participants);
                    if (!app) {
                        app = endorphin('msg-app-widget', AppUI, {
                            target: target,
                            store,
                        });
                    }
                });
            },
        };
    }
    function createStore(staticRoot) {
        if (!store) {
            store = new CallsStore({ staticRoot });
        }
        return store;
    }

    return bootstrap;

}));
//# sourceMappingURL=bootstrap-widget.js.map
