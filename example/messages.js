/**
 * @file san composition api demo
 */
 import {
    defineComponent,
    template,
    data,
    messages,
    onInited,
    onAttached,
    onDetached,
    components,
    method
}  from '../index';

const wrapper = document.createElement('div');
document.body.appendChild(wrapper);


const Select = defineComponent(() => {
    template('<ul><slot></slot></ul>');
    const value = data('value', '');
    messages({
        'UI:select-item-selected': function (arg) {
            value.set(arg.value);
        },

        'UI:select-item-attached': function (arg) {
            this.items.push(arg.target);
            arg.target.data.set('selectValue', value.get());
        },

        'UI:select-item-detached': function (arg) {
            let len = this.items.length;
            while (len--) {
                if (this.items[len] === arg.target) {
                    this.items.splice(len, 1);
                }
            }
        }
    });

    onInited(function () {
        this.items = [];
    });
}, san);


let SelectItem = defineComponent(() => {
    template('<li on-click="select"><slot></slot></li>');
    const value = data('value', '');
    method({
        select: function () {
            this.dispatch('UI:select-item-selected', value.get());
        }
    });

    onAttached(function () {
        this.dispatch('UI:select-item-attached');
    });

    onDetached(function () {
        this.dispatch('UI:select-item-detached');
    });
}, san);

let App = defineComponent(() => {
    components({
        'ui-select': Select,
        'ui-selectitem': SelectItem
    });

    template(`
        <div>
            <strong>Messages</strong>
            <ui-select value="{=v=}">
                <ui-selectitem value="1">one</ui-selectitem>
                <ui-selectitem value="2">two</ui-selectitem>
            </ui-select>
            please click to select a item
            <b title="{{v}}">{{v}}</b>
        </div>
        `
    );
}, san);


(new App()).attach(wrapper);
