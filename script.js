const Modal = {
  index: 0,
  open() {
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close() {
    document.querySelector('.modal-overlay').classList.remove('active')
  },
  openModal2(index) {
    document.querySelector('.modal-opcao').classList.add('active')
    Modal.index = index
  },

  closeModal2() { //modal2 = modal com as opção de editar ou apagar
    document.querySelector('.modal-opcao').classList.remove('active')
  }
}


const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("Tabela:Salario/Profissao")) || []
  },
  set(pessoas) {
    localStorage.setItem("Tabela:Salario/Profissao", JSON.stringify(pessoas))
  }
}

const Data = {
  pessoas: Storage.get(),

  add(pessoa) {
    Data.pessoas.push(pessoa)
    App.reload()
  },
  remove(index) {
    Data.pessoas.splice(index, 1)
    Modal.closeModal2()
    App.reload()
  },

  ages() {
    //soma todas as idades
    let totalAges = 0
    Data.pessoas.forEach(pessoa => {
      totalAges += pessoa.age
    })

    return totalAges
  },

  salarys() {
    //soma todos os salarios
    let totalSalary = 0
    Data.pessoas.forEach(pessoa => {
      totalSalary += pessoa.salary
    })

    return totalSalary
  }
}

const Utils = {
  FormatCurrencySalary(salary) {
    salary = String(salary).replace(/\D/g, '')

    salary = Number(salary) / 100

    salary = salary.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return salary
  },
  FormatSalary(salary) {
    salary = Number(salary) * 100

    return salary
  },

  biggerClass(pessoa) {
    let maior = -1
    Data.pessoas.forEach(pessoa => {
      if (pessoa.salary > maior) {
        maior = pessoa.salary
      }
    })
    return pessoa.salary == maior ? 'bigger' : 'not'
  }
}

const DOM = {
  tbody: document.querySelector('#data-table tbody'),
  tfoot: document.querySelector('#data-table tfoot'),

  addPeople(pessoa, index) {
    const tr = document.createElement('tr')
    tr.setAttribute('onclick', `Modal.openModal2(${index})`)
    tr.dataset.index = index
    tr.innerHTML = DOM.innerHTML(pessoa, index)
    

    DOM.tbody.appendChild(tr)
  },
  innerHTML(pessoa, index) {
    const newSalary = Utils.FormatCurrencySalary(pessoa.salary)

    let isTheBiggest = Utils.biggerClass(pessoa)

    const html = `
    <td class="${isTheBiggest}">${pessoa.name}</td>
    <td class="${isTheBiggest}">${pessoa.age}</td>
    <td class="${isTheBiggest}">${pessoa.profession}</td>
    <td class="${isTheBiggest}">${newSalary}</td>
    `
    return html
  },

  UpDateValues() {
    document.querySelector('#DisplayAges').innerHTML = Data.ages()
    document.querySelector('#DisplaySalarys').innerHTML =
      Utils.FormatCurrencySalary(Data.salarys())
  },
  clearTbody() {
    DOM.tbody.innerHTML = ''
  }
}

const Form = {
  name: document.querySelector('#name'),
  age: document.querySelector('#age'),
  profession: document.querySelector('#profession'),
  salary: document.querySelector('#salary'),

  getValues() {
    return {
      name: Form.name.value,
      age: Form.age.value,
      profession: Form.profession.value,
      salary: Form.salary.value
    }
  },
  formatValues() {
    let { name, age, profession, salary } = Form.getValues()

    salary = Utils.FormatSalary(salary)
    age = Number(age)

    return { name, age, profession, salary }
  },
  validateForm() {
    const { name, age, profession, salary } = Form.getValues()

    if (
      name.trim() === '' ||
      age.trim() === '' ||
      profession.trim() === '' ||
      salary.trim() === ''
    ) {
      throw new Error('Por favor, preencha todos os campos')
    }
    if (age < 0 || age > 120) {
      throw new Error('Por favor, insira uma idade válida')
    }

    if (salary < 0) {
      throw new Error('Por favor, insira uma salário válido')
    }
  },
  clear() {
    Form.name.value = ''
    Form.age.value = ''
    Form.profession.value = ''
    Form.salary.value = ''
  },

  submit(event) {
    event.preventDefault()

    try {
      //validar os campos
      Form.validateForm()
      // formatar os dados para salvar
      const pessoa = Form.formatValues()
      Data.add(pessoa)
      //apagar os dados do formulário
      Form.clear()
      //Fechar o modal
      Modal.close()
    } catch (error) {
      alert(error.message)
    }
  }
}

const App = {
  init() {
    Data.pessoas.forEach((pessoa, index) => {
      DOM.addPeople(pessoa, index)
    })
    DOM.UpDateValues()

    Storage.set(Data.pessoas)
  },

  reload() {
    DOM.clearTbody()
    App.init()
  }
}

App.init()
