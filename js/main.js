(function (win, doc) {
    'use strict';


    function DOM(elements) {
        this.element = doc.querySelectorAll(elements);
    }

    DOM.prototype.on = function on(eventName, callback) {
        Array.prototype.forEach.call(this.element, function (element) {
            element.addEventListener(eventName, callback, false);
        });
    };

    DOM.prototype.off = function off(eventName, callback) {
        Array.prototype.forEach.call(this.element, function (element) {
            element.removeEventListener(eventName, callback, false);
        });
    };

    DOM.prototype.get = function get() {
        return this.element;
    };

    DOM.prototype.forEach = function forEach() {
        Array.prototype.forEach.apply(this.element, arguments);
    };

    var $a = new DOM('[data-js="link"]');

    $a.forEach(function (element) {
        element.addEventListener('click', function (e) {
            e.preventDefault();
            console.log(element + ' was clicked');
        });
    });


    var $formCEP = new DOM('[data-js="form-cep"]');
    var $inputCEP = new DOM('[data-js="input-cep"]');
    var $logradouro = new DOM('[data-js="logradouro"]');
    var $bairro = new DOM('[data-js="bairro"]');
    var $estado = new DOM('[data-js="estado"]');
    var $cidade = new DOM('[data-js="cidade"]');
    var $status = new DOM('[data-js="status"]');
    $formCEP.on('submit', handleSubmitFormCep);
    var ajax = new XMLHttpRequest();
    console.log($formCEP);

    function handleSubmitFormCep(event) {
        event.preventDefault();
        var url = getUrl();
        ajax.open('GET', url);
        ajax.send();
        ajax.addEventListener('readystatechange', handleReadyStateChange);
    }

    function getUrl() {
        return replaceCEP('https://viacep.com.br/ws/[CEP]/json/');
    }

    function replaceCEP(message) {
        return message.replace('[CEP]', clearCEP());
    }

    function clearCEP() {
        return $inputCEP.get()[0].value.replace(/\D/g, '');
    }

    function handleReadyStateChange() {
        debugger
        if (isRequestOk()) {
            getMessage('ok');
            fillCepFields();
        } else {
            debugger;
            getMessage('notExist');
            var data = parseData();
            data = clearData();
        }

    }
    function isRequestOk() {
        return ajax.readyState === 4 && ajax.status === 200;
    }

    function fillCepFields() {
        var data = parseData();
        if (!data) {
            getMessage('error');
            data = clearData();
        }

        $logradouro.get()[0].textContent = data.logradouro;
        $bairro.get()[0].textContent = data.bairro;
        $estado.get()[0].textContent = data.uf;
        $cidade.get()[0].textContent = data.localidade;

    }



    function parseData() {
        var result;
        try {
            result = JSON.parse(ajax.responseText);
        }
        catch (e) {
            result = null;
        }
        return result;
    }

    function clearData() {
        return {
            logradouro: '-',
            bairro: '-',
            estado: '-',
            cidade: '-'
        }
    }

    function getMessage(type) {
        debugger;
        var messages = {
            loading: replaceCEP('Buscando informações para o CEP [CEP]'),
            ok: replaceCEP('Endereço referente ao CEP [CEP]'),
            error: replaceCEP('Não encontramos o endereço para o CEP [CEP]'),
            notExist: replaceCEP('Formato de cep incorreto para o CEP [CEP]')
        };
        $status.get()[0].textContent = messages[type];
    }


})(window, document);