import { render, screen, within } from '@testing-library/react'
import Home from '../src/pages/index'
import { useAuth } from '../src/utils/authContext';

jest.mock('../src/utils/authContext', () => ({
  useAuth: jest.fn(),
}));

(useAuth as jest.Mock).mockReturnValue({
  isLoggedIn: true,
  login: jest.fn(),
  logout: jest.fn(),
});


describe('Home', () => {
  it('headings', () => {
    render(<Home />)
    const heading1 = screen.getByRole('heading', { level: 2, name: /Risk Assessment/i });
    const heading2 = screen.getByRole('heading', { level: 2, name: /De-Identification/i });

    expect(heading1).toBeTruthy();
    expect(heading2).toBeTruthy();
  })
})


