// contact Class: Represents a contact
class Contact {
  constructor(name, contact, address) {
    this.name = name;
    this.contact = contact;
    this.address = address;
  }
}
 
// UI Class: Handle UI Tasks
class UI {
  static displaycontacts() {
    const contacts = Store.getcontacts();

    contacts.forEach((contact) => UI.addcontactToList(contact));
  }

  static addcontactToList(contact) {
    const list = document.querySelector('#contact-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${contact.name}</td>
      <td>${contact.contact}</td>
      <td>${contact.address}</td>
      <td><i class="fas fa-trash-alt btn btn-danger delete"></i></td>
    `;

    list.appendChild(row);
  }
//<i class="fas fa-trash-alt"></i>
// <a href="#" class="btn btn-danger btn-sm delete">X</a>
  static deletecontact(el) {
    if(el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.container');
    const form = document.querySelector('#contact-form');
    container.insertBefore(div, form);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
  }

  static clearFields() {
    document.querySelector('#name').value = '';
    document.querySelector('#contact').value = '';
    document.querySelector('#address').value = '';
  }
}



// Store Class: Handles Storage
class Store {
  static getcontacts() {
    let contacts;
    if(localStorage.getItem('contacts') === null) {
      contacts = [];
    } else {
      contacts = JSON.parse(localStorage.getItem('contacts'));
    }

    return contacts;
  }

  static addcontact(contact) {
    const contacts = Store.getcontacts();
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  static removecontact(address) {
    const contacts = Store.getcontacts();

    contacts.forEach((contact, index) => {
      if(contact.address === address) {
        contacts.splice(index, 1);
      }
    });

    localStorage.setItem('contacts', JSON.stringify(contacts));
  }
}

// Event: Display contacts
document.addEventListener('DOMContentLoaded', UI.displaycontacts);

// Event: Add a contact
document.querySelector('#contact-form').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const name = document.querySelector('#name').value;
  const contact = document.querySelector('#contact').value;
  const address = document.querySelector('#address').value;

  // Validate
  if(name === '' || contact === '' || address === '') {
    UI.showAlert('Required fields', 'danger');
  } else {
    // Instatiate contact
    const contactObj = new Contact(name, contact, address);

    // Add contact to UI
    UI.addcontactToList(contactObj);

    // Add contact to store
    Store.addcontact(contactObj);

    // Show success message
    UI.showAlert('Contact Added', 'success');

    // Clear fields
    UI.clearFields();
  }
});

// Function to Remove a Contact
document.querySelector('#contact-list').addEventListener('click', (e) => {
  
  //Delete Contact from UI
  UI.deletecontact(e.target);

  //Delete From Storage
  console.log(e.target.parentElement.previousElementSibling.textContent);
  Store.removecontact(e.target.parentElement.previousElementSibling.textContent);

  //Show the alert Message
  UI.showAlert('Contact Removed', 'danger');
});

//Check validity of contact-number

function setInputFilter(textbox, inputFilter) {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
    textbox.addEventListener(event, function() {
      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      } else if (this.hasOwnProperty("oldValue")) {
        this.value = this.oldValue;
        this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
      }
    });
  });
}

setInputFilter(document.getElementById("contact"), function(value) {

  return /^\d*$/.test(value); 
  
});

