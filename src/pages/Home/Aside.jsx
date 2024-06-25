import React, { useContext, useState } from "react";
import "./aside.scss";
import { dataColors } from "../../utils/dataColors";
import { v4 as uuidv4 } from "uuid";
import { CustomContext } from "../../utils/Context";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Aside() {
  const [active, setActive] = useState(false);
  const [color, setColor] = useState(dataColors[0]);
  const [category, setCategory] = useState("");
  const { user, setUser, status, setStatus } = useContext(CustomContext);

  const addCategory = () => {
    let newCategory = {
      categoryName: category,
      id: uuidv4(),
      color,
      task: [],
    };
    axios
      .patch(`http://localhost:4000/users/${user.id}`, {
        categories: [...user.categories, newCategory],
      })
      .then(({ data }) => {
        setUser({
          ...data,
          token: user.token,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...data,
            token: user.token,
          })
        );
        setActive(false);
        setCategory("");
        toast("Папка добавлена");
      })
      .cath((err) => toast(`Папка не добавлена, ${err.message}`));
  };
  const logOutUser = () => {
    localStorage.removeItem("user");
    setUser({
      email: "",
    });
  };
  const checkCategories = () => {
    if (
      user.categories.findIndex((item) => item.categoryName === category) > -1
    ) {
      toast("Данная папка уже имеется");
    } else {
      addCategory();
    }
  };
  return (
    <aside className="aside">
      <button onClick={logOutUser} className="aside__leave">
        Выйти
      </button>
      <div className={`aside__all ${status === "all" ? 'active' : ""}`} onClick={()=> setStatus('all')}>
        <span>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.96 5.10001H5.74C5.2432 5.10001 5.2 5.50231 5.2 6.00001C5.2 6.49771 5.2432 6.90001 5.74 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74C5.2432 9.60001 5.2 10.0023 5.2 10.5C5.2 10.9977 5.2432 11.4 5.74 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74C5.2432 0.600006 5.2 1.00231 5.2 1.50001C5.2 1.99771 5.2432 2.40001 5.74 2.40001ZM2.86 5.10001H1.24C0.743197 5.10001 0.699997 5.50231 0.699997 6.00001C0.699997 6.49771 0.743197 6.90001 1.24 6.90001H2.86C3.3568 6.90001 3.4 6.49771 3.4 6.00001C3.4 5.50231 3.3568 5.10001 2.86 5.10001ZM2.86 9.60001H1.24C0.743197 9.60001 0.699997 10.0023 0.699997 10.5C0.699997 10.9977 0.743197 11.4 1.24 11.4H2.86C3.3568 11.4 3.4 10.9977 3.4 10.5C3.4 10.0023 3.3568 9.60001 2.86 9.60001ZM2.86 0.600006H1.24C0.743197 0.600006 0.699997 1.00231 0.699997 1.50001C0.699997 1.99771 0.743197 2.40001 1.24 2.40001H2.86C3.3568 2.40001 3.4 1.99771 3.4 1.50001C3.4 1.00231 3.3568 0.600006 2.86 0.600006Z"
              fill="#7C7C7C"
            />
          </svg>
        </span>
        <span className="aside__text">Все задачи</span>
      </div>
      <ul className="aside__menu">
        {user.categories.map((data) => (
          <li key={data.id} className={`aside__item ${status === data.categoryName ? 'active' : ""}`} onClick={()=>setStatus(data.categoryName)}>
            <span
              style={{ background: data.color }}
              className="aside__color"
            ></span>
            <span className="aside__text"> {data.categoryName}</span>
            <span className="aside__item-del">
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="#E3E3E3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6.24741 5L9.73899 1.50842C9.9047 1.343 9.99791 1.11853 9.99812 0.884393C9.99832 0.650251 9.90551 0.425617 9.74009 0.259907C9.57468 0.0941973 9.35021 0.000986589 9.11606 0.000779811C8.88192 0.000573033 8.65729 0.0933872 8.49158 0.258804L5 3.75038L1.50842 0.258804C1.34271 0.0930948 1.11796 0 0.883613 0C0.649264 0 0.424514 0.0930948 0.258804 0.258804C0.0930948 0.424514 0 0.649264 0 0.883613C0 1.11796 0.0930948 1.34271 0.258804 1.50842L3.75038 5L0.258804 8.49158C0.0930948 8.65729 0 8.88204 0 9.11639C0 9.35074 0.0930948 9.57549 0.258804 9.7412C0.424514 9.90691 0.649264 10 0.883613 10C1.11796 10 1.34271 9.90691 1.50842 9.7412L5 6.24962L8.49158 9.7412C8.65729 9.90691 8.88204 10 9.11639 10C9.35074 10 9.57549 9.90691 9.7412 9.7412C9.90691 9.57549 10 9.35074 10 9.11639C10 8.88204 9.90691 8.65729 9.7412 8.49158L6.24741 5Z" />
              </svg>
            </span>
          </li>
        ))}
      </ul>
      <div style={{ position: "relative" }}>
        <div className="aside__create" onClick={() => setActive(!active)}>
          <span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 1V11"
                stroke="#868686"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1 6H11"
                stroke="#868686"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="aside__text">Добавить папку</span>
        </div>
        <div style={{ display: active && "block" }} className="aside__popup">
          <input
            className="aside__field"
            type="text"
            placeholder="Название папки"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <div className="aside__colors">
            {dataColors.map((item) => (
              <span
                className="aside__col"
                key={item}
                style={{
                  background: item,
                  border: color === item ? "4px solid black " : "none",
                }}
                onClick={() => setColor(item)}
              />
            ))}
          </div>
          <button
            onClick={checkCategories}
            className="aside__add"
            type="button"
          >
            Добавить
          </button>
          <span className="aside__popup-close" onClick={() => setActive(false)}>
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10.315 0C4.62737 0 0 4.62737 0 10.315C0 16.0026 4.62737 20.63 10.315 20.63C16.0026 20.63 20.63 16.0026 20.63 10.315C20.63 4.62737 16.0026 0 10.315 0ZM14.0497 12.928C14.1265 13.0009 14.1879 13.0885 14.2303 13.1855C14.2727 13.2826 14.2952 13.3872 14.2966 13.4931C14.298 13.599 14.2781 13.7041 14.2382 13.8022C14.1983 13.9003 14.1392 13.9894 14.0643 14.0643C13.9894 14.1392 13.9003 14.1983 13.8022 14.2382C13.7041 14.2781 13.599 14.298 13.4931 14.2966C13.3872 14.2952 13.2826 14.2727 13.1855 14.2303C13.0885 14.1879 13.0009 14.1265 12.928 14.0497L10.315 11.4373L7.70203 14.0497C7.55202 14.1922 7.35226 14.2705 7.14536 14.2679C6.93846 14.2652 6.74077 14.1819 6.59446 14.0355C6.44814 13.8892 6.36477 13.6915 6.36212 13.4846C6.35947 13.2777 6.43775 13.078 6.58028 12.928L9.19275 10.315L6.58028 7.70203C6.43775 7.55202 6.35947 7.35226 6.36212 7.14536C6.36477 6.93846 6.44814 6.74077 6.59446 6.59446C6.74077 6.44814 6.93846 6.36477 7.14536 6.36212C7.35226 6.35947 7.55202 6.43775 7.70203 6.58028L10.315 9.19275L12.928 6.58028C13.078 6.43775 13.2777 6.35947 13.4846 6.36212C13.6915 6.36477 13.8892 6.44814 14.0355 6.59446C14.1819 6.74077 14.2652 6.93846 14.2679 7.14536C14.2705 7.35226 14.1922 7.55202 14.0497 7.70203L11.4373 10.315L14.0497 12.928Z"
                fill="#5C5C5C"
              />
            </svg>
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Aside;
