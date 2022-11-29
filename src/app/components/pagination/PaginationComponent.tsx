import { useEffect, useState } from "react";

type PaginationProps = {
  itemsPerPage: number;
  data: number;
  pageSelected: (page: string) => void;
};
interface Pages {
  id: number;
  value: number;
  active: boolean;
}
export const Pagination = ({
  itemsPerPage,
  data,
  pageSelected,
}: PaginationProps) => {
  const [itemsPage, setItemsPage] = useState<number>(itemsPerPage);
  const [pages, setPages] = useState<Pages[]>();
  const [nextState, setNextState] = useState<boolean>(false);
  const [previousState, setPreviousState] = useState<boolean>(false);
  useEffect(() => {
    setItemsPage(itemsPerPage);
    calcularPaginas();
  }, [data]);

  const calcularPaginas = () => {
    let auxItemsData = data;
    let arrPages = [];
    for (var i = 1; i <= Math.ceil(auxItemsData / itemsPage); i++) {
      let obj = {
        id: i,
        value: i,
        active: i == 1 ? true : false,
      };
      arrPages.push(obj);
    }
    setPages(arrPages);
    handleFirstPageSelected("1");
  };

  const handlePageSelected = (e: any) => {
    setNextState(false);
    setPreviousState(false);
    pageSelected(e.target.id);
    if (pages) {
      let aux = [...pages];
      aux.map((item) => (item.active = false));
      let index = aux.findIndex((item) => item.id.toString() == e.target.id);
      aux[index].active = true;
      setPages(aux);
    }
  };

  const handleFirstPageSelected = (id: string) => {
    pageSelected(id);
  };

  const handleNextPage = () => {
    if (pages) {
      if (pages?.length > 1) {
        const index = pages.findIndex((e) => e.active == true);
        let newIndex = index + 1;
        if (newIndex < pages.length) {
          if (newIndex > 0) {
            setPreviousState(false);
          }
          setNextState(false);
          pageSelected((newIndex + 1).toString());
          let aux = [...pages];
          aux.map((item) => (item.active = false));
          aux[newIndex].active = true;
          setPages(aux);
        } else {
          setNextState(true);
        }
      }
    }
  };

  const handlePreviousPage = () => {
    if (pages) {
      if (pages?.length > 1) {
        const index = pages.findIndex((e) => e.active == true);
        let newIndex = index - 1;
        if (newIndex >= 0) {
          if (newIndex < pages.length) {
            setNextState(false);
          }
          setPreviousState(false);
          pageSelected((newIndex + 1).toString());
          let aux = [...pages];
          aux.map((item) => (item.active = false));
          aux[newIndex].active = true;
          setPages(aux);
        } else {
          setPreviousState(true);
        }
      }
    }
  };

  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-end">
          <li className={`page-item ${previousState ? "disabled" : ""}`}>
            <a className="page-link" href="#" onClick={handlePreviousPage}>
              Previous
            </a>
          </li>
          {pages?.map((page) => (
            <li
              className={`page-item ${page.active ? "active" : ""}`}
              key={page.id}
            >
              <a
                className="page-link"
                href="#"
                id={page.id.toString()}
                onClick={handlePageSelected}
              >
                {page.value}
              </a>
            </li>
          ))}
          <li className={`page-item ${nextState ? "disabled" : ""}`}>
            <a className="page-link" href="#" onClick={handleNextPage}>
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};
