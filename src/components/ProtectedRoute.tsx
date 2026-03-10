import { Navigate } from "react-router-dom"

interface Props {
    children: JSX.Element
}

export default function ProtectedRoute({ children }: Props) {

    const user = localStorage.getItem("user")

    if (!user) {
        return <Navigate to="/" />
    }

    return children
}