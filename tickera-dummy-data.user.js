// ==UserScript==
// @name         Tickera dummy data
// @namespace    https://ticketree.de/
// @version      1.0
// @description  Add a button that fills dummy-data
// @author       Paul Rennecke
// @match        https://ticketree.de/kasse/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Funktion, um die Dummy-Daten einzutragen
    function fillDummyData() {
        // Alle Inputs durchgehen
        document.querySelectorAll('input').forEach(input => {
            const name = input.name;

            if (name && name.startsWith('owner_data_first_name_')) {
                input.value = '-';
            } else if (name && name.startsWith('owner_data_last_name_')) {
                input.value = '-';
            } else if (name && name.startsWith('owner_data_owner_email_') || name === 'billing_email') {
                input.value = 'massenerstellung@ticketree.de';
            } else if (name === 'billing_first_name' ||
                       name === 'billing_last_name' ||
                       name === 'billing_address_1' ||
                       name === 'billing_city' ||
                       name === 'billing_phone') {
                input.value = '-';
            } else if (name === 'billing_postcode') {
                input.value = '12345';
            }
        });
    }

    // Den neuen Button erstellen
    const button = document.createElement('button');
    button.textContent = 'Dummy-Daten eintragen';
    button.style.marginBottom = '10px';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.cursor = 'pointer';

    // Klick-Event für den Button
    button.addEventListener('click', fillDummyData);

    // Den Button vor dem ersten Element mit der Klasse "tickera_owner_info info_section" einfügen
    const targetElement = document.querySelector('.tickera_owner_info.info_section');
    if (targetElement) {
        targetElement.parentNode.insertBefore(button, targetElement);
    }
})();
