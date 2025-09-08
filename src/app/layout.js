import "./globals.css";

export const metadata = {
    title: "",
    description: "App em Next.js",
};

export default function RootLayout({ children }) {
    return (
        <html lang="pt-BR">
            <head>
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </head>
            <body>{children}</body>
        </html>
    );
}
