import { Course } from './types';

export const APP_NAME = "LumiLearn";

export const MOCK_COURSES: Course[] = [
  {
    id: "c-001",
    title: "精通 React 與 TypeScript：完整指南",
    description: "使用 React 18 和 TypeScript 的最新功能構建生產級應用程式。深入學習 Hooks、狀態管理和效能優化技巧。",
    thumbnail: "https://picsum.photos/800/450?random=1",
    instructor: {
      name: "Alex Dev",
      avatar: "https://picsum.photos/100/100?random=10",
      bio: "擁有 10 年經驗的資深前端工程師。"
    },
    price: 1499,
    originalPrice: 2699,
    rating: 4.9,
    students: 1250,
    views: 8500,
    category: "程式開發",
    level: "中階",
    tags: ["React", "TypeScript", "前端"],
    updatedAt: "2023-10-15",
    modules: [
      {
        id: "m-1",
        title: "React 簡介",
        lessons: [
          { id: "l-1-1", title: "為什麼選擇 React？", duration: "5:20", videoId: "Tn6-PIqc4UM", isFree: true },
          { id: "l-1-2", title: "JSX 語法", duration: "8:45", videoId: "7fPXI_MnBOY", isFree: true }
        ]
      },
      {
        id: "m-2",
        title: "React Hooks 深入解析",
        lessons: [
          { id: "l-2-1", title: "useState 與 useEffect", duration: "12:30", videoId: "0ZJgIjIuY7U", isFree: false },
          { id: "l-2-2", title: "自定義 Hooks", duration: "15:00", videoId: "6ThXsUwLWqo", isFree: false }
        ]
      }
    ]
  },
  {
    id: "c-002",
    title: "數位攝影大師班",
    description: "學習如何使用 DSLR 或無反光鏡相機拍出驚人的照片。全面了解光圈、快門速度、ISO 和構圖法則。",
    thumbnail: "https://picsum.photos/800/450?random=2",
    instructor: {
      name: "Sarah Lens",
      avatar: "https://picsum.photos/100/100?random=11",
      bio: "作品刊登於國家地理雜誌的專業攝影師。"
    },
    price: 1050,
    originalPrice: 2100,
    rating: 4.8,
    students: 3200,
    views: 12400,
    category: "攝影",
    level: "入門",
    tags: ["攝影", "藝術", "創意"],
    updatedAt: "2023-09-20",
    modules: [
      {
        id: "m-1",
        title: "相機基礎",
        lessons: [
          { id: "l-1-1", title: "認識曝光", duration: "10:15", videoId: "VArISvUuyr0", isFree: true },
          { id: "l-1-2", title: "構圖法則", duration: "14:20", videoId: "7lCXT7aQGQI", isFree: false }
        ]
      }
    ]
  },
  {
    id: "c-003",
    title: "Figma 極簡 UI 設計",
    description: "使用 Figma 設計美觀、乾淨且易用的介面。從線框圖繪製到高保真原型設計。",
    thumbnail: "https://picsum.photos/800/450?random=3",
    instructor: {
      name: "Jean Des",
      avatar: "https://picsum.photos/100/100?random=12",
      bio: "知名科技巨頭產品設計師。"
    },
    price: 899,
    originalPrice: 1799,
    rating: 4.7,
    students: 890,
    views: 4500,
    category: "設計",
    level: "入門",
    tags: ["Figma", "UI/UX", "設計"],
    updatedAt: "2023-11-01",
    modules: [
      {
        id: "m-1",
        title: "Figma 基礎",
        lessons: [
          { id: "l-1-1", title: "介面概覽", duration: "6:00", videoId: "4W4LvTwTzgw", isFree: true },
          { id: "l-1-2", title: "Frame 的使用", duration: "9:30", videoId: "FTFaQWZBqQ8", isFree: false }
        ]
      }
    ]
  },
  {
    id: "c-004",
    title: "財務自由：投資入門 101",
    description: "掌控您的個人財務。了解股票、債券、ETF 以及如何建立多元化的投資組合。",
    thumbnail: "https://picsum.photos/800/450?random=4",
    instructor: {
      name: "Mike Cash",
      avatar: "https://picsum.photos/100/100?random=13",
      bio: "認證理財規劃師 (CFP)。"
    },
    price: 1799,
    originalPrice: 1799,
    rating: 4.5,
    students: 5400,
    views: 22000,
    category: "商業",
    level: "入門",
    tags: ["金融", "投資", "理財"],
    updatedAt: "2023-08-10",
    modules: [
      {
        id: "m-1",
        title: "金錢觀念",
        lessons: [
          { id: "l-1-1", title: "資產與負債", duration: "12:00", videoId: "p7HKvqRI_Bo", isFree: true }
        ]
      }
    ]
  },
   {
    id: "c-005",
    title: "日式家常料理",
    description: "您可以在家製作的正宗食譜。包含壽司、拉麵、丼飯等美味料理。",
    thumbnail: "https://picsum.photos/800/450?random=5",
    instructor: {
      name: "Yuki Chef",
      avatar: "https://picsum.photos/100/100?random=14",
      bio: "東京人氣食堂主廚。"
    },
    price: 750,
    originalPrice: 1050,
    rating: 4.9,
    students: 2100,
    views: 6700,
    category: "生活風格",
    level: "入門",
    tags: ["烹飪", "美食", "日式"],
    updatedAt: "2023-12-05",
    modules: [
      {
        id: "m-1",
        title: "米飯料理",
        lessons: [
          { id: "l-1-1", title: "完美的壽司飯", duration: "18:00", videoId: "j67ckj48d74", isFree: true }
        ]
      }
    ]
  }
];