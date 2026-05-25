/**
 * Base skeleton block — uses .skeleton shimmer from index.css
 */
const Skeleton = ({ className = "", style }) => (
  <div className={`skeleton ${className}`.trim()} style={style} />
);

export default Skeleton;
