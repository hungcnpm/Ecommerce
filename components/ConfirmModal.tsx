"use client"

export default function ConfirmModal({title,onConfirm,onCancel}:any){
  return(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-80 text-center">

        <h2 className="text-lg font-semibold mb-4">
          {title}
        </h2>

        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
          >
            No
          </button>
        </div>

      </div>
    </div>
  )
}