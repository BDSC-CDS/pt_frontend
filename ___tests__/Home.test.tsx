import { render, screen, within } from '@testing-library/react'
import Home from '../src/pages/index'
import { useAuth } from '../src/utils/AuthContext';

jest.mock('../src/utils/AuthContext', () => ({
  useAuth: jest.fn(),
}));

(useAuth as jest.Mock).mockReturnValue({
  isLoggedIn: true,
  login: jest.fn(),
  logout: jest.fn(),
});

describe('Home', () => {
  it('heading', () => {
    render(<Home />)
    const heading = screen.getByRole('heading', { level: 2, name: /Welcome to the SPHN Privacy Toolbox platform!/i });
    expect(heading).toBeTruthy();
  })
})
