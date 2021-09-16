console.log("=== CEP ===");

(function () {

  // User Interface
  const UI = {
    fieldZipcode: document.querySelector("#cep"),
    titlePage: document.querySelector("legend"),
    fieldStreet: document.querySelector("#logradouro"),
    fieldNeighborhood: document.querySelector("#bairro"),
    fieldCity: document.querySelector("#cidade"),
    fieldState: document.querySelector("#estado"),
    allFields: document.querySelectorAll("input")
  };

  // Actions
  const onlyNumbers = e => {
    e.target.value = e.target.value.replace(/\D/gi, "");

    if (e.target.value.length > 8) {
      e.target.value = e.target.value.slice(0, 8);
    }
  };
  
  const validateEntry = e => {
    if (e.target.value.length < 8) {
      e.target.classList.add("error");
      e.target.focus();
    } else {
      e.target.classList.remove("error");
      getAddress(e.target.value);
    }
  };
  
  const getAddress = async zipcode => {
    localStorage.setItem("zipcode", zipcode);

    const endpoint = `https://viacep.com.br/ws/${zipcode}/json/`;

    const config = {
      method: "GET",
      headers: new Headers({
        "Content-type": "application/json"
      })
    };

    try {
      const response = await fetch(endpoint, config);
      const address = await response.json();
      getAddressSuccess(address);
    } catch (error) {
      getAddressError(error, zipcode);
    }
  };

  const getAddressError = (err, zipcode) => {
    console.warn(err);
    UI.titlePage.textContent = `Falha ao consultar o CEP: ${zipcode}. Por favor, tente novamente!`;
    UI.titlePage.style.color = "red";
    UI.fieldZipcode.value = "";
    UI.fieldZipcode.classList.add("error");
    UI.fieldZipcode.focus();
  };

  const getAddressSuccess = endereco => {
    UI.titlePage.textContent = `Consulta por CEP`;
    UI.titlePage.style.color = "black";

    // es6 destructuring
    const { logradouro, bairro, localidade, uf, cep } = endereco;
    
    if (logradouro && bairro && localidade && uf && cep) {
      UI.fieldZipcode.value = cep;
      UI.fieldStreet.value = logradouro;
      UI.fieldNeighborhood.value = bairro;
      UI.fieldCity.value = localidade;
      UI.fieldState.value = uf;
    } else {
      UI.allFields.forEach(field => field.value = "");
      throw new Error("Campos indefinidos!");
    }
  };

  // Binding Events
  UI.fieldZipcode.addEventListener("input", onlyNumbers); // onlyNumbers(InputEvent);
  UI.fieldZipcode.addEventListener("focusout", validateEntry);

  // Initialize
  getAddress(localStorage.zipcode);
})();
