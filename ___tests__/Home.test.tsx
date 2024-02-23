import { render, screen, within } from '@testing-library/react'
import Home from '../src/pages/index'

xdescribe('Home', () => {
  it('heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 2, name: /Welcome to The Frontend App/i });
    expect(heading).toBeTruthy();  })
})
