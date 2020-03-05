describe('Automatic QA', () => {
  beforeEach(() => {
    cy.setCookie('wileyEncodedLocale', 'en-us')
    cy.visit('https://www.wiley.com/en-us/')
  })

  context('Content', () => {
    it('Check items under the "Who We Serve for" sub-header', () => {
      cy.contains('WHO WE SERVE')
        .next()
        .find('ul')
        .first()
        .children('li')
        .should($li => {
          expect($li, '12 items').to.have.length(12)
          expect($li.eq(0)).to.contain('Students')
          expect($li.eq(1)).to.contain('Instructors')
          expect($li.eq(2)).to.contain('Book Authors')
          expect($li.eq(3)).to.contain('Professionals')
          expect($li.eq(4)).to.contain('Researchers')
          expect($li.eq(5)).to.contain('Institutions')
          expect($li.eq(6)).to.contain('Librarians')
          expect($li.eq(7)).to.contain('Corporations')
          expect($li.eq(8)).to.contain('Societies')
          expect($li.eq(9)).to.contain('Journal Editors')
          expect($li.eq(10)).to.contain('Bookstores')
          expect($li.eq(11)).to.contain('Government')
        })
    })
  })

  context('Action', () => {
    const desired = 'Java'

    it('Check search functionality - test 1', () => {
      let serchFormBottom
      let resultAreaTop

      cy.get('aside#ui-id-2').as('resultArea')

      cy.get('@resultArea')
        .should('be.hidden')
        .get('input#js-site-search-input')
        .type(desired)
        .then($in => {
          serchFormBottom = $in[0].getBoundingClientRect().bottom
        })
        .get('@resultArea')
        .should('be.visible')
        .then($area => {
          resultAreaTop = $area[0].getBoundingClientRect().top
          expect(
            serchFormBottom,
            'Area is right under the search header'
          ).to.be.eq(resultAreaTop)
        })
    })

    it('Check search functionality - test 2', () => {
      cy.get('input#js-site-search-input')
        .type(desired)
        .get('span.input-group-btn')
        .click()

      cy.get('.product-item')
        .should('contain', desired)
        .and('to.have.length', 10)
        .find('a > img')
        .should('be.visible')
        .each(($img, index) => {
          expect(
            $img[0].naturalWidth,
            `Displayed thumbnail #${index + 1}`
          ).to.be.gt(0)
        })
    })
  })
})
