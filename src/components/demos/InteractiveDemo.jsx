import CatEyesDemo from "./CatEyesDemo";
import CategoryExploreDemo from "./CategoryExploreDemo";
import GiraffeNeckDemo from "./GiraffeNeckDemo";
import MagnetAttractDemo from "./MagnetAttractDemo";
import MoonShapeDemo from "./MoonShapeDemo";
import PenguinFeetDemo from "./PenguinFeetDemo";
import PipaStringDemo from "./PipaStringDemo";
import RainbowDemo from "./RainbowDemo";
import SoapBubbleDemo from "./SoapBubbleDemo";
import SunflowerDemo from "./SunflowerDemo";

export default function InteractiveDemo({ lesson, moonPhase, setMoonPhase }) {
  const lessonId = lesson.id;
  if (lessonId === "cat-eyes") {
    return <CatEyesDemo />;
  }

  if (lessonId === "penguin-feet") {
    return <PenguinFeetDemo />;
  }

  if (lessonId === "giraffe-neck") {
    return <GiraffeNeckDemo />;
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

  if (lessonId === "magnet") {
    return <MagnetAttractDemo />;
  }

  if (lessonId === "soap-bubble-round") {
    return <SoapBubbleDemo />;
  }

  return <CategoryExploreDemo key={lesson.id} lesson={lesson} />;
}
