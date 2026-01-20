// "use client";
// import React from 'react';

// interface DetailModalProps<T> {
//   isOpen: boolean;
//   onClose: () => void;
//   rowData: T | null;
//   title?: string;
// }

// export default function DetailModal<T>({
//   isOpen,
//   onClose,
//   rowData,
//   title = "ព័ត៌មានលម្អិត",
// }: DetailModalProps<T>) {
//   if (!isOpen || !rowData) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
//       <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
//         {/* Header */}
//         <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-rose-600 text-white rounded-t-lg">
//           <h3 className="text-lg font-semibold">{title}</h3>
//           <button
//             onClick={onClose}
//             className="text-white hover:text-gray-200 text-2xl leading-none"
//           >
//             ×
//           </button>
//         </div>
//         <div className="px-6 py-5 space-y-4">
//           {Object.entries(rowData as any).map(([key, value]) => (
//             <div key={key} className="grid grid-cols-3 gap-4">
//               <dt className="text-sm font-medium text-gray-600 capitalize">
//                 {key.replace(/([A-Z])/g, ' $1')}
//               </dt>
//               <dd className="col-span-2 text-sm text-gray-900">
//                 {String(value ?? '—')}
//               </dd>
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 bg-gray-50 rounded-b-lg">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
//           >
//             បិទ
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }