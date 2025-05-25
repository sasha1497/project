// import React from 'react';

// interface CardItem {
//     id: number;
//     title: string;
//     image: string;
//     description: string;
// }

// const items: CardItem[] = [
//     {
//         id: 1,
//         title: 'Car 1',
//         image: 'https://via.placeholder.com/300x200?text=Car+1',
//         description: 'Description for Car 1',
//     },
//     {
//         id: 2,
//         title: 'Car 2',
//         image: 'https://via.placeholder.com/300x200?text=Car+2',
//         description: 'Description for Car 2',
//     },
//     {
//         id: 3,
//         title: 'Car 3',
//         image: 'https://via.placeholder.com/300x200?text=Car+3',
//         description: 'Description for Car 3',
//     },
//     {
//         id: 4,
//         title: 'Car 4',
//         image: 'https://via.placeholder.com/300x200?text=Car+4',
//         description: 'Description for Car 4',
//     },
// ];

// const chunkArray = (arr: CardItem[], size: number) => {
//     return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
//         arr.slice(i * size, i * size + size)
//     );
// };

// const ProfileImageCarousel: React.FC = () => {
//     const chunkedItems = chunkArray(items, 4); // 2 cards per slide

//     return (
//         //     <div id="carouselCards" className="carousel slide container-fluid" data-bs-ride="carousel">
//         //       <div className="carousel-inner">
//         //         {chunkedItems.map((group, i) => (
//         //           <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
//         //             <div className="d-flex justify-content-center gap-3">
//         //               {group.map((item) => (
//         //                 <div className="card" style={{ width: '18rem' }} key={item.id}>
//         //                   <img src={item.image} className="card-img-top" alt={item.title} />
//         //                   <div className="card-body">
//         //                     <h5 className="card-title">{item.title}</h5>
//         //                     <p className="card-text">{item.description}</p>
//         //                   </div>
//         //                 </div>
//         //               ))}
//         //             </div>
//         //           </div>
//         //         ))}
//         //       </div>

//         //       {/* Controls */}
//         //       <button
//         //         className="carousel-control-prev"
//         //         type="button"
//         //         data-bs-target="#carouselCards"
//         //         data-bs-slide="prev"
//         //       >
//         //         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//         //         <span className="visually-hidden">Previous</span>
//         //       </button>

//         //       <button
//         //         className="carousel-control-next"
//         //         type="button"
//         //         data-bs-target="#carouselCards"
//         //         data-bs-slide="next"
//         //       >
//         //         <span className="carousel-control-next-icon" aria-hidden="true"></span>
//         //         <span className="visually-hidden">Next</span>
//         //       </button>
//         //     </div>
//         //   );

//         <div className="container-fluid overflow-hidden">
//             <div id="carouselCards" className="carousel slide" data-bs-ride="carousel">
//                 <div className="carousel-inner">
//                     {chunkedItems.map((group, i) => (
//                         <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
//                             <div className="row g-3 justify-content-center">
//                                 {group.map((item) => (
//                                     <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item.id}>
//                                         <div className="card h-100">
//                                             <img src={item.image} className="card-img-top img-fluid" alt={item.title} />
//                                             <div className="card-body">
//                                                 <h5 className="card-title">{item.title}</h5>
//                                                 <p className="card-text">{item.description}</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {/* Carousel Controls */}
//                 <button
//                     className="carousel-control-prev"
//                     type="button"
//                     data-bs-target="#carouselCards"
//                     data-bs-slide="prev"
//                 >
//                     <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//                     <span className="visually-hidden">Previous</span>
//                 </button>

//                 <button
//                     className="carousel-control-next"
//                     type="button"
//                     data-bs-target="#carouselCards"
//                     data-bs-slide="next"
//                 >
//                     <span className="carousel-control-next-icon" aria-hidden="true"></span>
//                     <span className="visually-hidden">Next</span>
//                 </button>
//             </div>
//         </div>
//     )
// };

// export default ProfileImageCarousel;

import React, { useEffect, useRef, useState } from "react";
import "./profileimage.css"; // Import styles

const defaultItemCount = 7;
const itemWidth = 238;

const items = [
  {
    src: "https://i.pinimg.com/736x/62/95/68/629568699f7d80b6e53d31277a150f85.jpg",
    text: "Leena",
  },
  {
    src: "https://i.pinimg.com/736x/6f/1f/43/6f1f439f6bf10c97dfd9450be2ca1f0a.jpg",
    text: "Sana",
  },
  {
    src: "https://i.pinimg.com/736x/f6/ca/4e/f6ca4e472a169c12eef87d0be64a6673.jpg",
    text: "teena",
  },
  {
    src: "https://i.pinimg.com/736x/79/5b/1f/795b1ffa7ab8ffb0abb4ee0bcd7c463d.jpg",
    text: "Mia",
  },
];

const ProfileImageCarousel: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [clonedItems, setClonedItems] = useState<any[]>([]);

  const manageChildren = (childCount: number) => {
    const clones: any[] = [];
    for (let i = 0; i < childCount; i++) {
      for (let j = 0; j < defaultItemCount; j++) {
        const item = items[j % items.length];
        clones.push(item);
      }
    }
    setClonedItems(clones);
    if (contentRef.current) {
      contentRef.current.style.width = `${itemWidth * defaultItemCount * (childCount + 1)}px`;
    }
  };

  const core = (width: number) => {
    if (width <= 1920) {
      manageChildren(2);
    } else if (width <= 2560) {
      manageChildren(3);
    } else if (width <= 3840) {
      manageChildren(4);
    } else {
      manageChildren(8);
    }
  };

  useEffect(() => {
    core(window.innerWidth);

    const handleResize = () => {
      clearTimeout((handleResize as any)._timeout);
      (handleResize as any)._timeout = setTimeout(() => core(window.innerWidth), 300);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allItems = [...items, ...clonedItems];

  return (
    <div className="scroll-container d-flex justify-content-center align-items-center mt-3 mb-5">
      <div className="infinite-scroll-wrapper position-relative w-100 overflow-hidden">
        <div
          className="infinite-scroll-content d-flex flex-row"
          ref={contentRef}
        >
          <div className="infinite-scroll-items d-flex flex-row">
            {allItems.map((item, index) => (
              <div className="item-wrap position-relative" key={index}>
                <img src={item.src} alt={item.text} className="w-100 h-100 object-cover" />
                <span className="text position-absolute text-white fw-medium bg-dark w-5 p-2">
                  {item.text}<span className="dot"></span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageCarousel;

