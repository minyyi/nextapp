const AddCard = () => {
  return (
    <>
      {/* 기존 폼 코드 */}
      {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {partners.map((partner) => (
          <div
            key={partner.id}
            className="flex flex-col gap-4 rounded-lg border p-4"
          >
            <div className="flex gap-3 justify-between">
              <div className="flex gap-3 items-center">
                <FaClipboardCheck
                  size={30}
                  color={partner.color !== "#ffffff" ? partner.color : defaultIconColor}
                />
                <h2 className="text-xl font-semibold">{partner.name}</h2>
              </div>
              <div>
                <button onClick={() => handleEdit(partner)} className="mr-2 text-blue-500">
                  <FaEdit />
                </button>
                <button onClick={() => handleDelete(partner.id)} className="text-red-500">
                  <FaTrash />
                </button>
              </div>
            </div>
            <div>
              <p>시간당 급여: {partner.hourlyRate}원</p>
            </div>
          </div>
        ))}
      </div> */}

      {/* 삭제 확인 모달 */}
      {/* {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <p>정말로 이 파트너를 삭제하시겠습니까?</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setShowDeleteModal(false)} className="mr-2 px-4 py-2 bg-gray-200 rounded">
                취소
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 text-white rounded">
                삭제
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default AddCard;
