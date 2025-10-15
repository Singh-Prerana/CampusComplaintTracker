export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-6 ">
            <div className="container w-full mx-auto px-4 text-center">
                <p className="text-sm">
                    © {new Date().getFullYear()} Campus Complaint Tracker. All rights reserved.
                </p>
            </div>
        </footer>
    )
}