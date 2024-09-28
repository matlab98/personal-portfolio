  import React from 'react';
  import { render, fireEvent, waitFor } from '@testing-library/react';
  import Touch from '../Touch'; // Asegúrate de ajustar la ruta según tu estructura de carpetas
  import emailjs from '@emailjs/browser';
  import sinon from 'sinon';
  import assert from 'assert'; // Usaremos assert de Node.js
  
  describe('Touch Component', () => {
    const email =  ["hbarrieta25@gmail.com", "hbarrieta13@gmail.com"];
  
    it('should render the contact form', () => {
      const { getByPlaceholderText, getByText } = render(<Touch email={email} />);
      
      // Verifica que los elementos del formulario se renderizan correctamente
      assert.ok(getByPlaceholderText('Tu nombre'));
      assert.ok(getByPlaceholderText('Correo'));
      assert.ok(getByPlaceholderText('Mensaje'));
      assert.ok(getByText('Enviar'));
    });
    
    
    it('should call emailjs.sendForm and display "ok" class when form submission is successful', async () => {
      const { getByText, getByPlaceholderText, container } = render(<Touch email={email} />);
      
      // Espía el método emailjs.sendForm
      const sendFormSpy = sinon.spy(emailjs, 'sendForm');
      
      // Simula la entrada de datos en los campos del formulario
      fireEvent.change(getByPlaceholderText('Tu nombre'), { target: { value: 'Juan Pérez' } });
      fireEvent.change(getByPlaceholderText('Correo'), { target: { value: 'juanperez@example.com' } });
      fireEvent.change(getByPlaceholderText('Mensaje'), { target: { value: 'Hola, me interesa tu trabajo.' } });
  
      // Simula el envío del formulario
      fireEvent.submit(getByText('Enviar').closest('form'));
      
      // Verifica que emailjs.sendForm haya sido llamado
      assert.strictEqual(sendFormSpy.calledOnce, true);
  
      // Verifica que el formulario tenga la clase "ok" después del envío exitoso
      const formElement = container.querySelector('#contact-form');

      assert.ok(formElement.classList);
      await waitFor(() => {
        const formElement = container.querySelector('#contact-form');
        assert.ok(formElement.classList.contains('ok'));
      }, { timeout: 3000 }); // Ajusta el tiempo de espera si es necesario
  
      // Limpia el espía
      sendFormSpy.restore();
    });
  });
  