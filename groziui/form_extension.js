export const FormExtension = {
  name: 'Forms',
  type: 'response',
  match: ({ trace }) =>
    trace.type === 'ext_form' || trace.payload.name === 'ext_form',
  render: ({ trace, element }) => {
    const formContainer = document.createElement('form')
    const userName =  !trace.payload || trace.payload == '0' ? '' : trace.payload

    formContainer.innerHTML = `
          <style>
            label {
              font-size: 0.8em;
              color: #888;
            }
            input[type="text"], input[type="email"] {
              width: 100%;
              border: none;
              border-bottom: 0.5px solid rgba(0, 0, 0, 0.1);
              background: transparent;
              margin: 5px 0;
              outline: none;
            }
            .invalid {
              border-color: red;
            }
            .submit {
              background: linear-gradient(to right, rgb(126 168 125), rgb(112 157 111));
              border: none;
              color: white;
              padding: 10px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
            }
            .cancel {
              background: linear-gradient(to right, rgb(186 91 91), rgb(186 91 91));
              border: none;
              color: white;
              padding: 10px;
              border-radius: 5px;
              width: 100%;
              cursor: pointer;
              margin-top: 5px;
            }
          </style>

          <label for="name">Name</label>
          <input type="text" class="name" name="name" required"><br><br>

          <label for="email">Email</label>
          <input type="email" class="email" name="email" required pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" title="Invalid email address"><br><br>

          <input type="submit" class="submit" value="Pateikti">
          <input type="button" class="cancel" value="Atšaukti">
        `

    formContainer.addEventListener('click', function (event) {
      
      if (event.target.classList.contains('cancel')) {
        formContainer.querySelector('.submit').remove()
        formContainer.querySelector('.cancel').remove()
        
        window.voiceflow.chat.interact({
          type: 'cancel',
        });
        return;
      }
    });
    
    formContainer.addEventListener('submit', function (event) {
      event.preventDefault()

      const name = formContainer.querySelector('.name')
      const email = formContainer.querySelector('.email')

      if (
        !name.checkValidity() ||
        !email.checkValidity()
      ) {
        name.classList.add('invalid')
        email.classList.add('invalid')
        return
      }

      formContainer.querySelector('.submit').remove()
      formContainer.querySelector('.cancel').remove()

      window.voiceflow.chat.interact({
        type: 'complete',
        payload: { name: name.value, email: email.value},
      })
    })

    element.appendChild(formContainer)
  },
}
