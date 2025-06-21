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

