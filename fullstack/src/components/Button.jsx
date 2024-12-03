export default function Button({ onClick, children,className }) {
  return <button onClick={onClick} className={className}>{children}</button>;
}
