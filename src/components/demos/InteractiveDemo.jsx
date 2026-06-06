import CatEyesDemo from "./CatEyesDemo";
import CategoryExploreDemo from "./CategoryExploreDemo";
import MoonShapeDemo from "./MoonShapeDemo";
import PenguinFeetDemo from "./PenguinFeetDemo";
import PipaStringDemo from "./PipaStringDemo";
import RainbowDemo from "./RainbowDemo";
import SunflowerDemo from "./SunflowerDemo";

export default function InteractiveDemo({ lesson, moonPhase, setMoonPhase }) {
  const lessonId = lesson.id;
  if (lessonId === "cat-eyes") {
    return <CatEyesDemo />;
  }

  if (lessonId === "penguin-feet") {
    return <PenguinFeetDemo />;
  }

  if (lessonId === "sunflower") {
    return <SunflowerDemo />;
  }

  if (lessonId === "moon-shape") {
    return <MoonShapeDemo moonPhase={moonPhase} setMoonPhase={setMoonPhase} />;
  }

  if (lessonId === "rainbow") {
    return <RainbowDemo />;
  }

  if (lessonId === "pipa-string") {
    return <PipaStringDemo />;
  }

  return <CategoryExploreDemo key={lesson.id} lesson={lesson} />;
}
