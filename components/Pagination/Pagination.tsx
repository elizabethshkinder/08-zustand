import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number; 
  totalPages: number;
  onPageChange: (page: number) => void; 
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const handlePageChange = (selectedItem: { selected: number }) => {
    onPageChange(selectedItem.selected + 1); 
  };

  return (
    <div className={css.wrapper}>
      <ReactPaginate
        pageCount={totalPages}
        forcePage={page - 1}
        onPageChange={handlePageChange}
        previousLabel="<"
        nextLabel=">"
        breakLabel="..."
        marginPagesDisplayed={1}
        pageRangeDisplayed={2}
        containerClassName={css.pagination}
        pageClassName={css.page}
        pageLinkClassName={css.pageLink}
        activeClassName={css.active}
        previousClassName={css.prev}
        nextClassName={css.next}
        disabledClassName={css.disabled}
        breakClassName={css.break}
      />
    </div>
  );
}