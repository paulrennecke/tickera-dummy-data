// ==UserScript==
// @name         Tickera fill data
// @namespace    https://ticketree.de/
// @version      1.2
// @description  Add buttons that fills dummy data or from xlsx
// @author       Paul Rennecke
// @match        https://ticketree.de/kasse/
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.16.9/xlsx.full.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function fillDummyData(jsonData) {
        const defaultValues = {
            billing_email: 'massenerstellung@ticketree.de',
            billing_first_name: '-',
            billing_last_name: '-',
            billing_address_1: '-',
            billing_city: '-',
            billing_phone: '-',
            billing_postcode: '12345'
        };

        let counters = { firstName: 0, lastName: 0, email: 0 };

        document.querySelectorAll('input').forEach(input => {
            const name = input.name;
            if (name.startsWith('owner_data_first_name_')) {
                input.value = jsonData?.[counters.firstName]?.[0] || '-';
                counters.firstName++;
            } else if (name.startsWith('owner_data_last_name_')) {
                input.value = jsonData?.[counters.lastName]?.[1] || '-';
                counters.lastName++;
            } else if (name.startsWith('owner_data_owner_email_')) {
                input.value = jsonData?.[counters.email]?.[2] || 'massenerstellung@ticketree.de';
                counters.email++;
            } else if (name.startsWith('owner_data_tc_ff_platzierung')) {
                input.value = jsonData?.[counters.firstName]?.[3] || '-';
            } else if (defaultValues[name] !== undefined) {
                input.value = defaultValues[name];
            }
        });
    }

    function createButton(text, onClick, styles = {}) {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, {
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            ...styles
        });
        button.addEventListener('click', onClick);
        return button;
    }

    function fillXLSXData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx';
        input.addEventListener('change', handleFileSelect);
        input.click();
    }

    function handleFileSelect(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
            fillDummyData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    }

    const targetElement = document.querySelector('.tickera_owner_info.info_section');
    if (targetElement) {
        const dummyButton = createButton('Dummy-Daten eintragen', () => fillDummyData());
        const xlsxButton = createButton('XLSX-Daten eintragen', (event) => {
            event.stopPropagation();
            event.preventDefault();
            fillXLSXData();
        }, { marginLeft: '10px'});
        xlsxButton.title='Excel-Datei,\n1.Spalte: Vorname\n2.Spalte: Nachname\n3.Spalte: Email';
        targetElement.parentNode.insertBefore(dummyButton, targetElement);
        targetElement.parentNode.insertBefore(xlsxButton, targetElement);
    }
})();
