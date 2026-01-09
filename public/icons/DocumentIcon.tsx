const DocumentIcon = ({ fill }: { fill: string }) => {
  return <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 3C0 1.35938 1.3125 0 3 0H10.5V6C10.5 6.84375 11.1562 7.5 12 7.5H18V21C18 22.6875 16.6406 24 15 24H3C1.3125 24 0 22.6875 0 21V3ZM12 6V0L18 6H12Z" fill={fill || '#FEFEFE'} />
  </svg>
};  


export default DocumentIcon;