import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Register from '../pages/Register'
import { useAuth } from '../contexts/AuthContext'

vi.mock('../contexts/AuthContext', () => ({
    useAuth: vi.fn(),
}))

const mockRegister = vi.fn()

beforeEach(() => {
    useAuth.mockReturnValue({
        register: mockRegister,
    })

    mockRegister.mockReset()
})

const renderPage = () => {
    render(
        <MemoryRouter>
            <Register />
        </MemoryRouter>
    )
}

describe('Register Page', () => {
    test('test register', () => {
        renderPage()

        expect(screen.getByLabelText('Name')).toBeInTheDocument()
        expect(screen.getByLabelText('Email')).toBeInTheDocument()
        expect(screen.getByLabelText('Password')).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
    })

    test('submits registration successfully', async () => {
        mockRegister.mockResolvedValueOnce({})

        renderPage()

        fireEvent.change(screen.getByLabelText('Name'), {
            target: { value: 'John' },
        })

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'john@test.com' },
        })

        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: '123456' },
        })

        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: '123456' },
        })

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalledTimes(1)
        })
    })

    test('shows error on failure', async () => {
        mockRegister.mockImplementationOnce(() =>
            Promise.reject({
                response: {
                    data: {
                        message: 'Email already exists',
                    },
                },
            })
        )

        renderPage()

        fireEvent.change(screen.getByLabelText('Email'), {
            target: { value: 'exists@test.com' },
        })

        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: '123456' },
        })

        fireEvent.change(screen.getByLabelText('Confirm Password'), {
            target: { value: '123456' },
        })

        fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    })
})