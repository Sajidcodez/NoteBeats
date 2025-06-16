# NoteBeats 🎵

NoteBeats is an innovative web application that transforms your study notes into song lyrics and audio. By leveraging AI technologies, this application helps students and learners convert their academic content into memorable musical pieces.

![NoteBeats Logo](public/next.svg)

## 🚀 Features

- **Notes to Lyrics Conversion**: Convert your study notes into creative song lyrics using AI
- **Audio Generation**: Generate audio from the created lyrics using ElevenLabs voice synthesis
- **Real-time Streaming**: Experience real-time streaming of the generated content
- **Audio Player**: Built-in audio player for immediate playback
- **Responsive Design**: Mobile-friendly interface that works across devices

## 🔧 Technology Stack

### Frontend
- **Next.js 15.3.1**: React framework with App Router for building the user interface
- **React 19**: JavaScript library for building user interfaces
- **TailwindCSS 4**: Utility-first CSS framework for styling
- **TypeScript 5**: Type-safe JavaScript

### Backend & APIs
- **OpenRouter API**: Connects to AI models for generating lyrics (using Mistral Nemo)
- **ElevenLabs API**: Advanced voice synthesis for converting lyrics to audio
- **Hugging Face Transformers**: Text summarization using distilbart-cnn-6-6 model
- **AWS S3**: Cloud storage for application assets
- **Audio Merger API**: External service for processing audio files

### DevOps & Tooling
- **ESLint 9**: JavaScript linter for code quality
- **Turbopack**: Next.js bundler for faster development
- **dotenv**: Environment variable management

## 📋 Prerequisites

- Node.js 18.x or higher
- npm, yarn, pnpm, or bun package manager
- API keys for:
  - OpenRouter
  - ElevenLabs
  - AWS (for S3 storage)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/NoteBeats.git
cd NoteBeats
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Create a `.env` file in the root directory with the following variables:
```
NODE_ENV=development
OPENROUTER_KEY=your_openrouter_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
BUCKET_NAME=your_s3_bucket_name
REGION=your_aws_region
ACCESS_KEY_ID=your_aws_access_key
SECRET_ACCESS_KEY=your_aws_secret_key
```

## 🚀 Running the Application

Start the development server with Turbopack:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📦 Build for Production

```bash
npm run build
npm run start
# or
yarn build
yarn start
# or
pnpm build
pnpm start
# or
bun build
bun start
```

## 📝 Project Structure

```
NoteBeats/
├── Lib/                # Library files
│   ├── aws.ts          # AWS S3 client configuration
│   ├── db.ts           # Database utilities
│   └── utils.ts        # General utility functions
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js App Router
│   │   ├── api/        # API routes
│   │   │   ├── audio/  # Audio processing endpoints
│   │   │   ├── convert-notes/ # Note conversion endpoints
│   │   │   ├── rap/    # Rap generation endpoints
│   │   │   └── summarization/ # Text summarization
│   │   ├── components/ # React components
│   │   ├── globals.css # Global styles
│   │   └── page.tsx    # Home page
├── .env                # Environment variables (not tracked by git)
├── .gitignore          # Git ignore file
├── eslint.config.mjs   # ESLint configuration
├── next.config.ts      # Next.js configuration
├── package.json        # Project dependencies
├── postcss.config.mjs  # PostCSS configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # Project documentation
```

## 🧪 How It Works

1. User enters their study notes in the text area
2. Notes are summarized using Hugging Face Transformers
3. The summary is sent to OpenRouter to generate lyrics using Mistral Nemo AI model
4. The lyrics are converted to audio using ElevenLabs voice synthesis
5. The audio is processed and made available for playback

## 🔒 Environment Variables

This application requires several API keys to function properly:

| Variable | Description |
|----------|-------------|
| `OPENROUTER_KEY` | API key for OpenRouter AI services |
| `ELEVENLABS_API_KEY` | API key for ElevenLabs voice synthesis |
| `BUCKET_NAME` | AWS S3 bucket name for storage |
| `REGION` | AWS region for S3 bucket |
| `ACCESS_KEY_ID` | AWS access key ID |
| `SECRET_ACCESS_KEY` | AWS secret access key |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgements

- [Next.js](https://nextjs.org) - The React Framework
- [OpenRouter](https://openrouter.ai) - AI model API provider
- [ElevenLabs](https://elevenlabs.io) - Voice synthesis technology
- [Hugging Face](https://huggingface.co) - AI models for text summarization
- [Vercel](https://vercel.com) - Deployment platform

## 📧 Contact

For questions or feedback, please reach out to [your-email@example.com](mailto:your-email@example.com).
