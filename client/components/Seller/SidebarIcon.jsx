
import { useRouter } from 'next/router';

const SideBarIcon = ({ icon, text = "tooltip 💡", link, onClick }) => {
    const router = useRouter();
    const handleClick = ()=>router.push(link)
    const isActive = router.pathname===link;
    return (
      <div onClick={link?handleClick:onClick} className={`sidebar-icon group ${isActive?'activeIcon':''}`}>
        {icon}
        <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
      </div>
    );
  };

  export default SideBarIcon;