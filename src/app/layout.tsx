import Navbar from './navbar';
import FirstTop from './firstTop';
import TypeNotes from './typeNotes';
import ShowAudio from './showAudio';  
import Footer from './footer';
import './globals.css';

export const metadata = {
  title: 'NoteBeats',
  description: 'Music and notes app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-16">
          {children}
          
          <div className="container mx-auto px-4 py-6">
            <FirstTop />
          </div>
          
          <div className="container mx-auto px-4 py-6">
            <TypeNotes />
          </div>
          
          <div className="container mx-auto px-4 py-6">
            <ShowAudio />
          </div>
        </main>
        
        <Footer />
      </body>
    </html>
  );
}