export async function generateStaticParams() {
  // Возвращаем статический путь для страницы contacts
  return [
    {
      region: 'contacts.html', // Добавляем .html к пути
    },
  ];
}