function Footer() {
  return (
    <footer className="mt-auto border-t bg-white py-6">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} MyBlogs. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="#" className="hover:text-blue-600">Terms</a>
          <a href="#" className="hover:text-blue-600">Privacy</a>
          <a href="#" className="hover:text-blue-600">Contact</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
