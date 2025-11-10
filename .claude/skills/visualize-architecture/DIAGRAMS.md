# Guided Meditation Architecture Diagrams

This document provides comprehensive Mermaid diagrams visualizing the architecture of the guided meditation experience.

## 1. Component Interaction

This diagram shows how the main components work together to orchestrate the meditation experience.

```mermaid
graph TB
    subgraph "Bootstrap Layer"
        Bootstrap[bootstrap function]
        LoadData[loadSequenceData]
        InitTimeline[initTimeline]
    end

    subgraph "Data Layer"
        SequenceJSON[sequence.json]
        MetadataJSON[checkpoint-metadata.json]
        EnrichedSequence[Enriched Sequence Array]
    end

    subgraph "Core Components"
        MediaFactory[Media Factory<br/>- Preload & cache media<br/>- Reset videos<br/>- Error tracking]
        StageComposer[Stage Composer<br/>- Clone template<br/>- Populate content<br/>- Render choices]
        StageManager[Stage Manager<br/>- Activate stages<br/>- Fade transitions<br/>- Remove old stages]
        HueController[Hue Controller<br/>- Track checkpoints<br/>- Update CSS hue<br/>- Trigger color shift]
        StatusStore[Status Store<br/>- Observable state<br/>- Event publishing<br/>- UI updates]
    end

    subgraph "Timeline Orchestration"
        RunTimeline[runTimeline function]
        Iterator[Sequence Iterator Loop]
    end

    subgraph "Presentation Layer"
        Template[HTML Template]
        Container[Asset Container]
        DOM[Live DOM Stages]
        StatusBanner[Status Banner UI]
    end

    Bootstrap --> LoadData
    LoadData --> SequenceJSON
    LoadData --> MetadataJSON
    LoadData --> EnrichedSequence
    Bootstrap --> InitTimeline

    InitTimeline --> MediaFactory
    InitTimeline --> StageComposer
    InitTimeline --> StageManager
    InitTimeline --> HueController
    InitTimeline --> RunTimeline

    RunTimeline --> Iterator
    Iterator --> MediaFactory
    Iterator --> HueController
    Iterator --> StageComposer
    Iterator --> StageManager

    MediaFactory -.preloaded media.-> StageComposer
    StageComposer --> Template
    StageComposer -.stage element.-> StageManager
    StageManager --> Container
    Container --> DOM

    StatusStore --> StatusBanner
    Iterator -.status events.-> StatusStore

    EnrichedSequence --> RunTimeline

    style MediaFactory fill:#4a90e2,stroke:#2e5c8a,color:#fff
    style StageComposer fill:#7b68ee,stroke:#5a4ab8,color:#fff
    style StageManager fill:#50c878,stroke:#3a9660,color:#fff
    style HueController fill:#ff6b6b,stroke:#cc5555,color:#fff
    style StatusStore fill:#ffd93d,stroke:#ccae31,color:#333
```

## 2. Data Flow

This diagram traces how data flows from JSON files through the application to the rendered DOM.

```mermaid
flowchart TD
    Start([Application Start]) --> FetchSequence[Fetch sequence.json]
    Start --> FetchMetadata[Fetch checkpoint-metadata.json]

    FetchSequence --> SequenceArray[Sequence Array<br/>checkpoint/transition items]
    FetchMetadata --> MetadataArray[Metadata Array<br/>enrichment data]

    SequenceArray --> CreateLookup[Create Metadata Lookup Map<br/>filename → metadata]
    MetadataArray --> CreateLookup

    CreateLookup --> EnrichSequence[Enrich Sequence<br/>Merge metadata into items]

    EnrichSequence --> EnrichedItems[Enriched Sequence Items<br/>item + metadata]

    EnrichedItems --> TimelineLoop{For Each Item}

    TimelineLoop --> BuildAssetURL[Build Asset URL<br/>/assets/...]
    BuildAssetURL --> InferKind{Infer Media Kind}

    InferKind -->|transition or .mp4| CreateVideo[Create Video Element<br/>muted, playsinline, preload]
    InferKind -->|checkpoint or image| CreateImage[Create Image Element<br/>async decoding, alt text]

    CreateVideo --> PreloadVideo[Preload Video<br/>canplaythrough event]
    CreateImage --> PreloadImage[Preload Image<br/>load event]

    PreloadVideo --> CacheEntry[Cache in Media Factory<br/>asset path → entry]
    PreloadImage --> CacheEntry

    CacheEntry --> ExtractAltText[Extract Alt Text<br/>metadata.description || title || caption]
    ExtractAltText --> CloneTemplate[Clone Stage Template<br/>HTML fragment]

    CloneTemplate --> PopulateStage[Populate Stage<br/>- Insert media element<br/>- Set caption text<br/>- Render choices list<br/>- Set data attributes]

    PopulateStage --> UpdateHue[Update Hue Controller<br/>Check if checkpoint #2]
    UpdateHue --> ActivateStage[Activate Stage<br/>Append to container<br/>Add is-active class]

    ActivateStage --> WaitForMedia{Media Type?}
    WaitForMedia -->|video| PlayVideo[Play Video<br/>await ended event]
    WaitForMedia -->|image| HoldCheckpoint[Hold for Duration<br/>read --checkpoint-hold-ms]

    PlayVideo --> FadeOut[Fade Out Previous Stage<br/>Remove is-active class]
    HoldCheckpoint --> FadeOut

    FadeOut --> RemovePrevious[Schedule Removal<br/>After transition duration]
    RemovePrevious --> TimelineLoop

    TimelineLoop -->|Done| Complete([Experience Complete])

    style SequenceArray fill:#e1f5ff,stroke:#4a90e2
    style MetadataArray fill:#fff4e1,stroke:#ffa726
    style EnrichedItems fill:#e8f5e9,stroke:#66bb6a
    style CacheEntry fill:#f3e5f5,stroke:#ab47bc
    style PopulateStage fill:#fff9c4,stroke:#ffd54f
    style ActivateStage fill:#ffebee,stroke:#ef5350
```

## 3. State Management

This diagram illustrates how sequence items flow through the timeline iterator and how state transitions occur.

```mermaid
stateDiagram-v2
    [*] --> LoadingData: bootstrap()

    LoadingData --> EnrichingSequence: JSON loaded
    EnrichingSequence --> ReadyToIterate: Metadata merged

    ReadyToIterate --> IteratingSequence: runTimeline()

    state IteratingSequence {
        [*] --> FetchingNextItem

        FetchingNextItem --> CheckingCache: Get item from sequence

        CheckingCache --> CacheHit: Asset cached
        CheckingCache --> CacheMiss: Asset not cached

        CacheMiss --> CreatingMediaEntry: mediaFactory.ensure()
        CreatingMediaEntry --> Preloading: Create img/video element

        Preloading --> PreloadSuccess: Load event
        Preloading --> PreloadError: Error event

        PreloadError --> SkippedAsset: Track in skipped array
        SkippedAsset --> FetchingNextItem

        CacheHit --> RefreshingAltText: Update alt attribute
        PreloadSuccess --> CachingEntry: Store in Map
        CachingEntry --> RefreshingAltText

        RefreshingAltText --> ResettingMedia: entry.reset()
        ResettingMedia --> NotifyingHueController: hueController.willPresent()

        state NotifyingHueController {
            [*] --> CheckType
            CheckType --> IsCheckpoint: type === checkpoint
            CheckType --> IsTransition: type === transition
            IsTransition --> [*]
            IsCheckpoint --> IncrementCounter
            IncrementCounter --> CheckCount
            CheckCount --> Count0: count = 1
            CheckCount --> Count1: count = 2
            CheckCount --> CountOther: count > 2
            Count0 --> [*]
            Count1 --> FlipToShiftHue
            CountOther --> [*]
            FlipToShiftHue --> UpdateCSSVariable
            UpdateCSSVariable --> [*]
        }

        NotifyingHueController --> ComposingStage: stageComposer.render()

        state ComposingStage {
            [*] --> CloneTemplate
            CloneTemplate --> SetDataAttributes
            SetDataAttributes --> InsertMediaElement
            InsertMediaElement --> PopulateCaptionText
            PopulateCaptionText --> CheckChoices
            CheckChoices --> HasChoices: choices array exists
            CheckChoices --> NoChoices: no choices
            HasChoices --> RenderChoicesList
            RenderChoicesList --> [*]
            NoChoices --> [*]
        }

        ComposingStage --> ActivatingStage: stageManager.activate()

        state ActivatingStage {
            [*] --> FadingOutPrevious
            FadingOutPrevious --> RemovingPreviousClass: Remove is-active
            RemovingPreviousClass --> AppendingNewStage
            AppendingNewStage --> AddingActiveClass: Add is-active
            AddingActiveClass --> TriggeringTransition: requestAnimationFrame
            TriggeringTransition --> ScheduleRemoval: transitionend listener
            ScheduleRemoval --> [*]
        }

        ActivatingStage --> WaitingForStage: waitForStage()

        state WaitingForStage {
            [*] --> DetermineWaitType
            DetermineWaitType --> VideoWait: entry.type === video
            DetermineWaitType --> ImageWait: entry.type === image

            VideoWait --> PlayingVideo: video.play()
            PlayingVideo --> AwaitingEnded: ended listener
            AwaitingEnded --> [*]

            ImageWait --> ReadingCSSVariable: --checkpoint-hold-ms
            ReadingCSSVariable --> StartingTimeout: setTimeout()
            StartingTimeout --> AwaitingTimeout
            AwaitingTimeout --> [*]
        }

        WaitingForStage --> PresentedComplete
        PresentedComplete --> FetchingNextItem: Next item
        PresentedComplete --> [*]: No more items
    }

    IteratingSequence --> CheckingResults: Timeline complete

    state CheckingResults {
        [*] --> CountPresented
        CountPresented --> AllSkipped: presentedCount === 0
        CountPresented --> SomeSkipped: skipped.length > 0
        CountPresented --> AllSuccess: skipped.length === 0

        AllSkipped --> ShowError
        SomeSkipped --> ShowWarning
        AllSuccess --> ClearStatus

        ShowError --> [*]
        ShowWarning --> [*]
        ClearStatus --> [*]
    }

    CheckingResults --> [*]
```

## 4. Stage Lifecycle

This diagram shows the complete lifecycle of a stage from creation through activation to removal.

```mermaid
sequenceDiagram
    participant Timeline as Timeline Iterator
    participant MF as Media Factory
    participant HC as Hue Controller
    participant SC as Stage Composer
    participant SM as Stage Manager
    participant DOM as DOM Container
    participant Browser as Browser Renderer

    Note over Timeline: For each sequence item

    Timeline->>MF: ensure(item)
    activate MF

    alt Asset not cached
        MF->>MF: Create img/video element
        MF->>Browser: Set src, trigger load
        Browser-->>MF: Load event (canplaythrough/load)
        MF->>MF: Cache entry in Map
    else Asset cached
        MF->>MF: Retrieve from cache
        MF->>MF: Refresh alt text
    end

    MF-->>Timeline: Return entry { element, ready, reset() }
    deactivate MF

    Timeline->>Timeline: await entry.ready

    alt Preload failed
        Timeline->>Timeline: Add to skipped array
        Timeline->>Timeline: Continue to next item
    end

    Timeline->>MF: entry.reset()
    Note over MF: Videos: pause(), currentTime = 0<br/>Images: no-op

    Timeline->>HC: willPresent(item)
    activate HC

    alt Item is checkpoint
        HC->>HC: Increment checkpoint counter
        alt Counter reaches 2
            HC->>Browser: Set --accent-hue to shift value
            Note over Browser: CSS animation updates border color
        end
    end

    HC-->>Timeline: Hue updated
    deactivate HC

    Timeline->>SC: render(item, entry)
    activate SC

    SC->>DOM: Clone template#stage
    SC->>SC: Extract stage root [data-stage]
    SC->>SC: Set data-type attribute

    SC->>SC: Find media slot [data-media-slot]
    SC->>DOM: Append entry.element to slot

    SC->>SC: Find caption text [data-caption-text]
    SC->>DOM: Set textContent from item.caption

    alt Item has choices
        SC->>SC: Find choice list [data-choice-list]
        SC->>DOM: Create <li> for each choice
        SC->>DOM: Show choices list
        SC->>DOM: Add has-choices class
    end

    SC-->>Timeline: Return cloned stage element
    deactivate SC

    Timeline->>SM: activate(stage)
    activate SM

    alt Previous stage exists
        SM->>DOM: Remove is-active from old stage
        Note over DOM,Browser: CSS transition begins fade-out
        SM->>SM: scheduleRemoval(oldStage)
        SM->>Browser: Add transitionend listener
        SM->>Browser: Set fallback timeout
    end

    SM->>DOM: Append new stage to container
    SM->>Browser: requestAnimationFrame()
    Browser->>SM: Animation frame callback
    SM->>DOM: Add is-active to new stage

    Note over DOM,Browser: CSS transition begins fade-in<br/>Opacity: 0 → 1

    SM-->>Timeline: Stage activated
    deactivate SM

    Note over Browser: Browser renders active stage<br/>Animation plays: radiateBorder

    Timeline->>Timeline: waitForStage(stage, entry)

    alt Entry is video
        Timeline->>Browser: video.play()
        Browser-->>Timeline: Playing video
        Browser-->>Timeline: Video ended event
    else Entry is image
        Timeline->>Browser: Read --checkpoint-hold-ms
        Timeline->>Timeline: setTimeout(duration)
        Note over Timeline: Wait for hold duration
    end

    Note over Timeline: Wait complete, loop continues

    par Previous stage removal
        Browser-->>DOM: transitionend event fires
        DOM->>SM: Event listener triggered
        SM->>DOM: stage.remove()
        Note over DOM: Old stage removed from tree
    end

    Timeline->>Timeline: Continue to next item

    Note over Timeline,Browser: Cycle repeats for each item
```

## Architecture Summary

### Key Design Principles

1. **Separation of Concerns**: Each component has a single, well-defined responsibility
2. **Async/Generator Pattern**: Timeline uses async iteration for natural sequence flow
3. **Caching Strategy**: Media Factory caches elements to avoid redundant preloads
4. **Template-Based Rendering**: Stage Composer clones HTML templates for consistent structure
5. **CSS-Driven Timing**: JavaScript reads CSS custom properties for configuration
6. **Observable Pattern**: Status Store uses pub/sub for decoupled UI updates
7. **Graceful Degradation**: Skipped assets are tracked but don't halt the experience

### Component Responsibilities

| Component | Input | Output | Side Effects |
|-----------|-------|--------|--------------|
| **Media Factory** | Sequence item | Cached media entry | Creates/caches img/video elements |
| **Stage Composer** | Item + cached entry | Cloned stage element | None (pure rendering) |
| **Stage Manager** | Stage element | - | Manipulates DOM, manages transitions |
| **Hue Controller** | Sequence item | - | Updates CSS custom properties |
| **Status Store** | Event object | - | Notifies subscribers, updates banner |
| **Timeline Iterator** | Enriched sequence | Presentation stats | Orchestrates all components |

### Data Structures

**Sequence Item (enriched)**:
```javascript
{
  type: 'checkpoint' | 'transition',
  asset: 'path/to/file.ext',
  caption: 'Display text',
  choices?: ['Choice A', 'Choice B'],
  metadata: {
    filename: 'file.ext',
    title: 'Display Title',
    description: 'Alt text description'
  }
}
```

**Media Entry**:
```javascript
{
  type: 'video' | 'image',
  element: HTMLVideoElement | HTMLImageElement,
  error: Error | null,
  ready: Promise<Element>,
  reset: () => void
}
```

### Critical Paths

1. **Happy Path**: Load JSON → Enrich → Preload → Render → Activate → Wait → Next
2. **Error Path**: Load failure → Skip item → Track in skipped → Continue
3. **Hue Shift**: Checkpoint #2 → Trigger hue flip → Update CSS variable → Border animation updates
4. **Stage Transition**: New stage activate → Fade in new → Fade out old → Remove old after transition

### Performance Characteristics

- **Preloading**: Sequential (one at a time) to avoid network congestion
- **Caching**: Map-based lookup, O(1) retrieval
- **Template Cloning**: Deep clone with content population
- **CSS Transitions**: Hardware-accelerated opacity changes
- **Memory Management**: Old stages removed after fade completes
- **Error Handling**: Non-blocking, tracked separately

---

*Generated for the Guided Meditation project - Architecture visualization using Mermaid*
