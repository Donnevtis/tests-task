const XLSX = require('xlsx')

describe('Entering data with JS', () => {
  before(() => {
    cy.visit(
      'https://app.smartsheet.com/b/form/bd77635c5e3a4fb59fe9e84bb88d0d57'
    )
    cy.get('input#loginEmail').type('ge_editorial@wiley.ru')
    cy.get('input#formControl').click()
    cy.get('input#loginPassword').type('smartsheettestuser')
    cy.get('input#formControl').click()
  })

  it('enter the Data', () => {
    cy.fixture('Input_test_data.xlsx', 'base64').then(xlsx => {
      const workbook = XLSX.read(xlsx)
      const jsonSheet = XLSX.utils.sheet_to_json(workbook.Sheets.Data, {
        raw: false
      })

      // A date formatting function
      const dateFormat = rawData => {
        const date = new Date(rawData)
        return date.toLocaleString('en-US', {
          day: '2-digit',
          year: 'numeric',
          month: '2-digit'
        })
      }

      // Approach #1
      jsonSheet.forEach(row => {
        cy.get(`[data-client-id=text_box_ISBN_10]`).type(row['ISBN_10'])
        cy.get(`[data-client-id=text_box_Title]`).type(row['Title'])
        cy.get(`[data-client-id=text_box_Author]`).type(row['Author'])
        cy.get(`[data-client-id=text_box_Year]`).type(row['Year'])
        cy.get('[data-client-id=dropdown_Quarter]')
          .click()
          .contains(row['Quarter'])
          .click()
        if (row.IS_Approved === 'Y') cy.get(`[for=checkbox_id_bWYyAkd]`).click()
        if (row.To_Publish === 'Y') cy.get(`[for=checkbox_id_38DN9DW]`).click()
        cy.get(`[data-client-id=date_Prod_Date]`).type(
          dateFormat(row['Prod_Date'])
        )
        cy.get(`[data-client-id=date_Pub_Date]`).type(
          dateFormat(row['Pub_Date'])
        )
        cy.get(`[data-client-id=dropdown_Status]`)
          .click()
          .contains(row['Status'])
          .click()
        cy.get(`[data-client-id=text_box_List_Price]`).type(row['List_Price'])
        cy.get(`[data-client-id=text_box_Net_Price]`).type(row['Net_Price'])
        cy.get(`[data-client-id="text_box_Entered By"]`).type(row['Entered By'])
        cy.get('button[type=submit]').click()
      })

      // Approach #2
      /*   jsonSheet.forEach(row => {
        for (const [key, value] of Object.entries(row)) {
          if (key === 'Seq_No') continue
          const sheetValue = key.match(/Date/g) ? dateFormat(value) : value

          if (sheetValue === 'Y') {
            cy.contains('label', key)
              .next()
              .find('label')
              .click()
          } else if (sheetValue !== 'N') {
            cy.contains('label', key)
              .parent()
              .find('input')
              .focus()
              .type(`${sheetValue}{enter}`)
          }
        }
        cy.get('form').submit()
        cy.wait(3000)
      }) */
    })
  })
})
